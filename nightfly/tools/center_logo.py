"""Replace the original hanging badge with the supplied logo on the swing arm.

Run: python3 nightfly/tools/center_logo.py (requires Pillow).
Edits the self-contained binary GLB, not an overlay in the browser.
"""
from collections import deque
from io import BytesIO
from pathlib import Path
import json
import struct

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / 'public/nightfly.glb'
LOGO = ROOT / 'assets/nightfly-logo-reference.jpg'
LOGO_NODE = 'Nightfly logo | centered swing-arm decal'


def make_logo_png():
    im = Image.open(LOGO).convert('RGBA')
    pixels = im.load()
    width, height = im.size
    visited = bytearray(width * height)
    queue = deque()
    for x in range(width):
        queue.extend(((x, 0), (x, height - 1)))
    for y in range(height):
        queue.extend(((0, y), (width - 1, y)))

    def background_pixel(x, y):
        r, g, b, _ = pixels[x, y]
        return min(r, g, b) >= 226 and max(r, g, b) - min(r, g, b) < 28

    # Only clear the connected light background, not white details inside the logo.
    while queue:
        x, y = queue.popleft()
        index = y * width + x
        if visited[index]:
            continue
        visited[index] = 1
        if not background_pixel(x, y):
            continue
        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        if x: queue.append((x - 1, y))
        if x + 1 < width: queue.append((x + 1, y))
        if y: queue.append((x, y - 1))
        if y + 1 < height: queue.append((x, y + 1))

    box = im.getbbox()
    if box:
        im = im.crop(box)
    output = BytesIO()
    im.save(output, 'PNG', optimize=True)
    return output.getvalue(), im.width / im.height


def patch_model():
    raw = MODEL.read_bytes()
    magic, version, length = struct.unpack_from('<4sII', raw)
    if magic != b'glTF' or version != 2 or length != len(raw):
        raise ValueError('Expected a valid glTF 2.0 binary file')
    json_length, json_type = struct.unpack_from('<II', raw, 12)
    if json_type != 0x4e4f534a:
        raise ValueError('Missing JSON chunk')
    data = json.loads(raw[20:20 + json_length])
    nodes = data['nodes']
    if any(n.get('name') == LOGO_NODE for n in nodes):
        print('Nightfly logo is already patched; no further changes.')
        return
    bin_header = 20 + json_length
    bin_length, bin_type = struct.unpack_from('<II', raw, bin_header)
    if bin_type != 0x004e4942:
        raise ValueError('Missing BIN chunk')
    bin_data = bytearray(raw[bin_header + 8:bin_header + 8 + bin_length])

    def find(name):
        candidates = [i for i, node in enumerate(nodes) if node.get('name') == name]
        if len(candidates) != 1:
            raise ValueError(f'Expected exactly one node named {name}, got {len(candidates)}')
        return candidates[0]

    tower = find('Tower tilt hinge')
    main = find('Main swing axis')
    badge = find('Badge backing')
    old_logo = find('Hub logo')
    for old in (badge, old_logo):
        # Detach only decorative meshes; never renumber joints or animated nodes.
        if old not in nodes[tower]['children']:
            raise ValueError('Original badge must be a direct child of the tower')
        nodes[tower]['children'].remove(old)

    def append_view(blob, target=None):
        while len(bin_data) % 4:
            bin_data.append(0)
        offset = len(bin_data)
        bin_data.extend(blob)
        view = {'buffer': 0, 'byteOffset': offset, 'byteLength': len(blob)}
        if target is not None:
            view['target'] = target
        index = len(data['bufferViews'])
        data['bufferViews'].append(view)
        return index

    def accessor(view, component_type, count, kind, minimum=None, maximum=None):
        a = {'bufferView': view, 'componentType': component_type,
             'count': count, 'type': kind}
        if minimum is not None:
            a['min'], a['max'] = minimum, maximum
        index = len(data['accessors'])
        data['accessors'].append(a)
        return index

    image_bytes, aspect_ratio = make_logo_png()
    # Swing-arm front fascia is at local z≈1.02; center of arm is local y=0.
    width = 1.08
    height = width / aspect_ratio
    x, y, z = width / 2, height / 2, 1.087
    vertices = [-x, -y, z, x, -y, z, x, y, z, -x, y, z]
    positions = accessor(append_view(struct.pack('<12f', *vertices), 34962),
                         5126, 4, 'VEC3', [-x, -y, z], [x, y, z])
    normals = accessor(append_view(struct.pack('<12f', *([0, 0, 1] * 4)), 34962),
                       5126, 4, 'VEC3')
    uvs = accessor(append_view(struct.pack('<8f', 0, 1, 1, 1, 1, 0, 0, 0), 34962),
                   5126, 4, 'VEC2')
    indices = accessor(append_view(struct.pack('<6H', 0, 1, 2, 0, 2, 3), 34963),
                       5123, 6, 'SCALAR', [0], [3])
    image_view = append_view(image_bytes)
    image_id = len(data.setdefault('images', []))
    data['images'].append({'name': 'Nightfly logo reference, transparent',
                           'bufferView': image_view, 'mimeType': 'image/png'})
    texture_id = len(data.setdefault('textures', []))
    data['textures'].append({'source': image_id})
    material_id = len(data.setdefault('materials', []))
    data['materials'].append({
        'name': 'Nightfly arm logo | decal', 'alphaMode': 'BLEND',
        'doubleSided': True,
        'pbrMetallicRoughness': {'baseColorTexture': {'index': texture_id},
                                'metallicFactor': 0, 'roughnessFactor': 0.85},
        'extensions': {'KHR_materials_unlit': {}},
    })
    extensions = data.setdefault('extensionsUsed', [])
    if 'KHR_materials_unlit' not in extensions:
        extensions.append('KHR_materials_unlit')
    mesh_id = len(data['meshes'])
    data['meshes'].append({'name': LOGO_NODE, 'primitives': [{
        'attributes': {'POSITION': positions, 'NORMAL': normals, 'TEXCOORD_0': uvs},
        'indices': indices, 'material': material_id,
    }]})
    new_node = len(nodes)
    nodes.append({'name': LOGO_NODE, 'mesh': mesh_id})
    nodes[main].setdefault('children', []).append(new_node)
    while len(bin_data) % 4:
        bin_data.append(0)
    data['buffers'][0]['byteLength'] = len(bin_data)
    json_bytes = json.dumps(data, separators=(',', ':'), ensure_ascii=False).encode('utf-8')
    json_bytes += b' ' * ((-len(json_bytes)) % 4)
    total = 12 + 8 + len(json_bytes) + 8 + len(bin_data)
    output = (struct.pack('<4sII', b'glTF', 2, total)
              + struct.pack('<II', len(json_bytes), 0x4e4f534a) + json_bytes
              + struct.pack('<II', len(bin_data), 0x004e4942) + bin_data)
    MODEL.write_bytes(output)
    print(f'Patched {MODEL.name}: removed old floating badge and logo, '
          f'embedded {len(image_bytes)}-byte transparent decal into moving arm ({total:,} bytes)')


if __name__ == '__main__':
    patch_model()
