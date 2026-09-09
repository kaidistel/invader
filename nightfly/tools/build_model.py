"""Pegasus 16 visual reconstruction. Python 3 + numpy; preview also matplotlib.
Units: metres. Z up internally; GLB exported Y up. Geometry is approximate.
"""
import numpy as np, math, json, struct, pathlib
P=pathlib.Path(__file__).parent
meshes=[]
colors={'frame':('#e5eaf0',.65,.29),'blue':('#f9bc17',.6,.26),'accent':('#ffce20',.45,.28),'dark':('#172332',.25,.45),'rubber':('#222932',.05,.7),'steel':('#aebfce',.9,.18),'deck':('#778797',.6,.5),'light':('#fff2c4',.15,.18)}
def mesh(name,v,f,mat): meshes.append((name,np.array(v,float),np.array(f,int),mat))
def box(name,c,s,mat,R=None):
 v=np.array([[x,y,z] for x in [-.5,.5] for y in [-.5,.5] for z in [-.5,.5]])*s
 if R is not None:v=v@R.T
 f=[[0,1,3],[0,3,2],[4,6,7],[4,7,5],[0,4,5],[0,5,1],[2,3,7],[2,7,6],[0,2,6],[0,6,4],[1,5,7],[1,7,3]]
 mesh(name,v+c,f,mat)
def cyl(name,a,b,r,mat,n=14,r2=None):
 a,b=np.array(a,float),np.array(b,float);d=b-a;d/=np.linalg.norm(d);u=np.cross(d,[0,0,1] if abs(d[2])<.95 else [0,1,0]);u/=np.linalg.norm(u);w=np.cross(d,u)
 v=[p+rr*(np.cos(t)*u+np.sin(t)*w) for p,rr in [(a,r),(b,r if r2 is None else r2)] for t in np.arange(n)*2*np.pi/n];v.extend([a,b]);f=[]
 for i in range(n):j=(i+1)%n;f.extend([[i,j,n+j],[i,n+j,n+i],[2*n,j,i],[2*n+1,n+i,n+j]])
 mesh(name,v,f,mat)
def beam(name,a,b,width,depth,mat):
 a,b=np.array(a,float),np.array(b,float);z=(b-a);l=np.linalg.norm(z);z/=l;x=np.cross([1,0,0] if abs(z[0])<.9 else [0,1,0],z);x/=np.linalg.norm(x);y=np.cross(z,x);box(name,(a+b)/2,[width,depth,l],mat,np.column_stack([x,y,z]))
def tube(name,pts,r,mat):
 for i,(a,b) in enumerate(zip(pts,pts[1:])):cyl(name+'_'+str(i),a,b,r,mat,10)
def polygon_prism(name,xy,z,h,mat):
 n=len(xy);v=[[*q,zz] for zz in [z,z+h] for q in xy];f=[]
 for i in range(1,n-1):f.extend([[0,i+1,i],[n,n+i,n+i+1]])
 for i in range(n):j=(i+1)%n;f.extend([[i,j,n+j],[i,n+j,n+i]])
 mesh(name,v,f,mat)
# Travel chassis, unfolding steel outriggers, levelling feet.
for x in [-.8,.8]:box('Trailer_longitudinal', [x,3,.58],[.27,12.8,.46],'dark')
for y in np.arange(-2.8,9,1.45):box('Trailer_crossmember',[0,y,.58],[1.9,.15,.25],'steel')
for y in [2,6.8]:
 for s in [-1,1]:
  a=[s*.8,y,.6];b=[s*3.1,y+(.9 if y>4 else -.9),.45]
  beam('Outrigger',a,b,.24,.3,'frame');cyl('Levelling_jack',[b[0],b[1],.16],[b[0],b[1],.75],.10,'steel');box('Footplate',[b[0],b[1],.10],[1.05,1.05,.15],'dark')
for y in [6.5,7.5]:
 for x in [-1.04,1.04]:
  cyl('Transport_tyre',[x-.16,y,.45],[x+.16,y,.45],.40,'rubber',20);cyl('Wheel_hub',[x-.17,y,.45],[x+.17,y,.45],.20,'steel',18)
# Polygonal station, 11 m wide and two stairs.
polygon_prism('Folding_station',[[-5.5,-9], [5.5,-9],[5.5,-1.5],[4.2,1],[2,2.5],[-2,2.5],[-4.2,1],[-5.5,-1.5]],.15,.50,'deck')
for x in np.arange(-5,5.1,1):box('Deck_panel_seam',[x,-4.5,.657],[.015,8.6,.01],'steel')
for x in [-4.4,4.4]:
 for i in range(4):box('Entry_step',[x,-10.1+i*.30,.08+i*.075],[2,.32,.16+i*.15],'deck')
# Rails along sides, leaving front access.
for x in [-5.4,5.4]:
 for y in np.arange(-8.7,-1.4,1.2):cyl('Railing_post',[x,y,.66],[x,y,1.72],.035,'steel',10)
 for z in [1.15,1.72]:cyl('Railing',[x,-8.7,z],[x,-1.5,z],.035,'steel',10)
# Operator cabin.
box('Operator_booth',[-4.5,-7.4,1.4],[1.85,1.3,1.5],'blue');box('Cabin_roof',[-4.5,-7.4,2.45],[2.2,1.65,.20],'frame')
for x in [-5.42,-3.58]:box('Cabin_window',[x,-7.4,2.03],[.035,1.1,.58],'dark')
box('Cabin_front_glass',[-4.5,-8.065,2.03],[1.55,.025,.58],'dark')
# Bent lifting boom and its twin hydraulic cylinders.
base=np.array([0,6.4,1.0]);elbow=np.array([0,3.3,5.35]);pivot=np.array([0,-2.8,7.55])
beam('Hubarm_lower',base,elbow,1.05,.8,'frame');beam('Hubarm_upper',elbow,pivot,1.05,.8,'frame')
beam('Hubarm_blue_inset',base+[.54,0,0],elbow+[.54,0,0],.055,.47,'blue');beam('Hubarm_blue_inset',elbow+[.54,0,0],pivot+[.54,0,0],.055,.47,'blue')
for pos in [base,elbow,pivot]:
 cyl('Main_pin',pos+[-.7,0,0],pos+[.7,0,0],.30,'steel',24)
 for s in [-1,1]:cyl('Pin_cap',pos+[s*.7,0,0],pos+[s*.76,0,0],.36,'blue',24)
for x in [-.72,.72]:
 a=np.array([x,3.8,.85]);b=np.array([x,2.1,5.85]);m=a+(b-a)*.60
 cyl('Hydraulic_barrel',a,m,.19,'blue',20);cyl('Hydraulic_piston',m,b,.105,'steel',18)
 for p in [a,b]:cyl('Hydraulic_pin',p+[-.15,0,0],p+[.15,0,0],.23,'steel',18)
# Main rotor; parked near-vertical as in supplied elevation.
hub=np.array([0,-2.8,2.6]);axis=(pivot-hub);axis/=np.linalg.norm(axis);top=pivot+axis*5.0
beam('Rotor_passenger_arm',hub,pivot,.60,.65,'blue');beam('Rotor_counterweight_arm',pivot,top,.64,.70,'blue');box('Counterweight',top-axis*.65,[.94,.9,1.5],'frame')
# Pivot gearbox is along X, rotor moves in YZ plane.
cyl('Rotor_drive',pivot+[-.70,0,0],pivot+[.7,0,0],.63,'dark',32)
cyl('Rotor_drive_cover',pivot+[-.78,0,0],pivot+[-.70,0,0],.70,'accent',32)
# Crown normal follows the long arm; four radial spokes and gondola axles.
U=np.array([1.,0,0]);V=np.cross(axis,U);center=hub-axis*.23
cyl('Crown_drive',center-axis*.25,center+axis*.4,.50,'steel',28)
for k in range(4):
 t=k*np.pi/2;rad=np.cos(t)*U+np.sin(t)*V;tan=-np.sin(t)*U+np.cos(t)*V
 end=center+rad*2.70
 beam('Crown_spoke_'+str(k+1),center,end,.25,.36,'blue')
 # fork and the full transverse four-seat carrier
 for s in [-1,1]:beam('Crown_fork',center+rad*1.7,end+tan*s*1.35,.16,.20,'blue')
 cyl('Gondola_axle_'+str(k+1),end-tan*1.62,end+tan*1.62,.12,'steel',20)
 for s in [-1,1]:
  cyl('Gondola_bearing',end+tan*s*1.34,end+tan*s*1.51,.23,'accent',20)
 # Seats stay upright in loading pose; local outward radial horizontal.
 out=np.array([rad[0],rad[1],0]);out/=np.linalg.norm(out);right=np.array([out[1],-out[0],0]);up=np.array([0,0,1]);R=np.column_stack([right,out,up])
 for j in range(4):
  c=end+tan*((j-1.5)*.68)-np.array([0,0,.47]);prefix=f'Gondola_{k+1}_Seat_{j+1}'
  def pt(x,y,z):return c+R@np.array([x,y,z])
  box(prefix+'_shell',pt(0,-.16,.34),[.62,.22,.91],'blue',R)
  box(prefix+'_back_pad',pt(0,-.045,.31),[.45,.12,.65],'rubber',R)
  box(prefix+'_seat',pt(0,.15,-.08),[.52,.51,.14],'rubber',R)
  box(prefix+'_headrest',pt(0,-.08,.81),[.42,.19,.28],'rubber',R)
  # Two padded shoulders and lower crossbar make the recognizable OTSR.
  for s in [-1,1]:
   pts=[pt(s*.21,-.06,.76),pt(s*.235,.16,.68),pt(s*.22,.30,.43),pt(s*.17,.32,.08)]
   tube(prefix+'_shoulder_restraint',pts,.055,'dark')
   tube(prefix+'_grab_handle',[pt(s*.18,.35,.38),pt(s*.18,.43,.34),pt(s*.18,.44,.19)],.018,'accent')
  tube(prefix+'_restraint_bridge',[pt(-.17,.32,.08),pt(0,.35,.04),pt(.17,.32,.08)],.045,'dark')
 # Hoop around each row extremity.
 for s in [-1,1]:
  e=end+tan*s*1.68
  pts=[e+out*(.5*math.sin(a))+up*(.7*math.cos(a)-.25) for a in np.linspace(-.7,3.8,16)]
  tube('Gondola_end_guard',pts,.026,'steel')
# Discrete lamp strips along the rotor and the crown spokes.
for f in np.linspace(.09,.94,27):
 p=hub+(top-hub)*f
 for s in [-1,1]:cyl('Rotor_LED',p+[s*.33,-.36,0],p+[s*.33,-.39,0],.038,'light',8)
for k in range(4):
 rad=np.cos(k*np.pi/2)*U+np.sin(k*np.pi/2)*V
 for d in np.linspace(.6,2.4,12):
  q=center+rad*d+axis*.20;cyl('Crown_LED',q,q+axis*.03,.035,'light',8)
# NIGHTFLY upgrade: geometry based on the additional close reference photos.
from PIL import Image
from matplotlib.textpath import TextPath
from matplotlib.font_manager import FontProperties
from scipy.spatial import Delaunay
texture_files={};uvs={}
colors.update({'yellow':('#ffd025',.45,.3),'black':('#11141b',.3,.38),'signblue':('#57c8ee',.35,.3),'white':('#eff4f7',.4,.3)})
# Replace slender generic spokes with tapered enclosed arms and Y-shaped ends.
meshes=[m for m in meshes if not (m[0].startswith(('Crown_spoke','Crown_fork','Crown_LED','Rotor_LED','Gondola_end_guard')))]
def taper(name,a,b,w0,w1,thick,normal,mat):
 a=np.array(a);b=np.array(b);n=np.array(normal);d=b-a;d/=np.linalg.norm(d);t=np.cross(n,d);t/=np.linalg.norm(t);n=np.cross(d,t)
 v=[p+t*w*s/2+n*thick*h/2 for p,w in [(a,w0),(b,w1)] for s,h in [(-1,-1),(1,-1),(1,1),(-1,1)]]
 mesh(name,v,[[0,2,1],[0,3,2],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[1,2,6],[1,6,5],[2,3,7],[2,7,6],[3,0,4],[3,4,7]],mat)
def lamp(name,p,n,r=.035):
 p=np.array(p);n=np.array(n);cyl(name,p,p+n*.025,r,'light',8)
def face(name,points,mat):mesh(name,points,[[0,i,i+1] for i in range(1,len(points)-1)],mat)
def text3d(label,c,width,height,mat='white'):
 from PIL import ImageDraw, ImageFont
 font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',90)
 bbox=font.getbbox(label);im=Image.new('L',(bbox[2]-bbox[0]+2,bbox[3]-bbox[1]+2));ImageDraw.Draw(im).text((-bbox[0]+1,-bbox[1]+1),label,font=font,fill=255)
 im=im.resize((max(180,int(width*130)),64),Image.Resampling.LANCZOS);mask=np.asarray(im)>110;h,w=mask.shape;verts=[];faces=[]
 for row in range(h):
  line=np.pad(mask[row].astype(int),(1,1));starts=np.where(np.diff(line)==1)[0];ends=np.where(np.diff(line)==-1)[0]
  for x0,x1 in zip(starts,ends):
   off=len(verts);verts.extend([[c[0]+(x/w-.5)*width,c[1],c[2]+(1-y/h)*height] for x,y in [(x0,row),(x1,row),(x1,row+1),(x0,row+1)]]);faces.extend([[off,off+1,off+2],[off,off+2,off+3]])
 mesh('Lettering_'+label,verts,faces,mat)
for k in range(4):
 t=k*np.pi/2;rad=np.cos(t)*U+np.sin(t)*V;tan=-np.sin(t)*U+np.cos(t)*V;end=center+rad*2.7
 taper('Nightfly_enclosed_spoke',center+rad*.30,center+rad*1.9,.93,.46,.34,axis,'steel')
 taper('Spoke_yellow_tip',center+rad*1.55,center+rad*2.08,.55,.4,.355,axis,'yellow')
 for s in [-1,1]:taper('Nightfly_Y_fork',center+rad*1.8,end+tan*s*1.37,.38,.25,.23,axis,'yellow')
 # Black sawtooth graphic applied to spoke face.
 pts=[center+rad*d+tan*w+axis*.184 for d,w in [(1.20,-.35),(1.57,-.27),(1.42,-.03),(1.70,.04),(1.45,.27),(1.10,.37),(1.33,.08),(1.05,-.02)]];face('Spoke_zigzag',pts,'black')
 for d in np.linspace(.52,1.65,13):
  wid=.41-(d-.4)*.15
  for s in [-1,1]:lamp('Crown_bulb',center+rad*d+tan*s*wid+axis*.19,axis,.035)
 # Curved mesh shields at both ends of each four-seat row.
 out=np.array([rad[0],rad[1],0]);out/=np.linalg.norm(out);up=np.array([0.,0,1])
 for s in [-1,1]:
  e=end+tan*s*1.67
  outline=[e+out*q+up*z for q,z in [(-.34,-.9),(.55,-.9),(.78,-.52),(.82,.12),(.56,.73),(.15,.91),(-.34,.63),(-.34,-.9)]]
  tube('Shield_perimeter',outline,.035,'steel')
  # Orthogonal thin-wire infill, with shortened top to follow curved guard.
  for q in np.arange(-.28,.68,.09):
   ztop=.78-max(0,q-.1)*.7;tube('Shield_vertical_wire',[e+out*q+up*(-.84),e+out*q+up*ztop],.007,'steel')
  for z in np.arange(-.8,.65,.09):
   qend=.7-max(0,z-.1)*.35;tube('Shield_horizontal_wire',[e+out*(-.28)+up*z,e+out*qend+up*z],.007,'steel')
  cyl('Gondola_end_motor',end+tan*s*1.55,end+tan*s*1.95,.21,'steel',20)
# Round yellow piping frames every seat, with thicker restraint pads.
for k in range(4):
 rad=np.cos(k*np.pi/2)*U+np.sin(k*np.pi/2)*V;tan=-np.sin(k*np.pi/2)*U+np.cos(k*np.pi/2)*V;end=center+rad*2.7
 out=np.array([rad[0],rad[1],0]);out/=np.linalg.norm(out);right=np.array([out[1],-out[0],0]);R=np.column_stack([right,out,[0,0,1]])
 for j in range(4):
  c=end+tan*((j-1.5)*.68)-np.array([0,0,.47]);pt=lambda x,y,z:c+R@np.array([x,y,z])
  tube('Seat_yellow_contour',[pt(-.28,.19,-.08),pt(-.30,-.1,.1),pt(-.27,-.18,.66),pt(-.18,-.18,.94),pt(.18,-.18,.94),pt(.27,-.18,.66),pt(.30,-.1,.1),pt(.28,.19,-.08)],.035,'yellow')
  for s in [-1,1]:tube('Padded_shoulder_arc',[pt(s*.20,-.02,.81),pt(s*.245,.17,.73),pt(s*.22,.31,.5)],.080,'rubber')
  box('Seat_undertray',pt(0,.11,-.19),[.55,.55,.13],'yellow',R)
# Wide lighting cladding on front-facing rotor surfaces, paired strips on sides.
front=np.array([0.,-1.,0]);side=np.array([1.,0,0])
for aa,bb in [(hub+axis*.5,pivot-axis*.78),(pivot+axis*.82,top-axis*.2)]:
 taper('Rotor_LED_panel',aa+front*.38,bb+front*.38,.85,.85,.07,front,'steel')
 length=np.linalg.norm(bb-aa)
 for d in np.arange(.10,length-.05,.16):
  p=aa+axis*d+front*.425
  for x in np.linspace(-.34,.34,5):lamp('Rotor_bulb',p+side*x,front,.036)
 # Bold yellow panel end with lightning-chevron.
 pp=aa+axis*(length*.70)+front*.43
 face('Rotor_black_lightning',[pp+side*x+axis*z for x,z in [(-.42,0),(-.18,.3),(0,.07),(.18,.30),(.42,0),(.42,.58),(-.42,.58)]],'black')
# Gear detail and technician maintenance platform behind the rotor bearing.
box('Maintenance_platform',[0,-1.85,6.85],[2.6,1.8,.16],'yellow')
for x in [-1.3,1.3]:
 for y in [-2.65,-1.9,-1.1]:cyl('Maintenance_post',[x,y,6.93],[x,y,7.92],.025,'steel',8)
 cyl('Maintenance_handrail',[x,-2.65,7.92],[x,-1.1,7.92],.03,'steel',10)
for a in np.arange(48)*np.pi/24:
 q=pivot+np.array([-.80,math.cos(a)*.67,math.sin(a)*.67]);box('Gear_tooth',q,[.10,.065,.065],'steel')
# Front perimeter railing, closely spaced bars, fascia and directional motifs.
for y,x0,x1 in [(-8.85,-3.3,3.3),(-7.0,-3.4,3.4)]:
 for z in [.74,1.72]:cyl('Front_rail',[x0,y,z],[x1,y,z],.035,'steel',10)
 for x in np.arange(x0,x1+.02,.17):cyl('Front_picket',[x,y,.74],[x,y,1.72],.014,'steel',8)
box('Nightfly_front_fascia',[0,-8.92,.99],[6.7,.09,.58],'frame')
text3d('N I G H T F L Y',[0,-8.98,.78],5.8,.40,'black')
for x in [-5.4,5.4]:
 for y in np.arange(-8.6,-1.5,.17):cyl('Side_picket',[x,y,.72],[x,y,1.7],.012,'steel',8)
# Warning chevrons on the base trim.
for x in np.arange(-5.35,5.25,.34):
 face('Fascia_warning_stripe',[[x,-9.015,.18],[x+.17,-9.015,.18],[x+.32,-9.015,.35],[x+.15,-9.015,.35]],'yellow')
# Rear themed wall: separated wings leave the machine spine free.
for s in [-1,1]:
 cx=s*3.3;box('Scenery_wall',[cx,.85,3.0],[5.9,.20,4.7],'dark')
 for x in [cx-2.93,cx+2.93]:box('Scenery_gold_border',[x,.72,3.0],[.09,.04,4.75],'yellow')
 for z in [.64,5.37]:box('Scenery_gold_border',[cx,.72,z],[5.9,.04,.09],'yellow')
 for x in np.arange(cx-2.75,cx+2.78,.17):
  for z in [.79,5.21]:lamp('Scenery_marquee_bulb',[x,.66,z],front,.037)
 for z in np.arange(.95,5.15,.17):
  for x in [cx-2.77,cx+2.77]:lamp('Scenery_marquee_bulb',[x,.66,z],front,.037)
 for y in [1.05]:
  for x in [cx-2.5,cx+2.5]:beam('Scenery_rear_brace',[x,y,.2],[x,y,5.4],.12,.12,'dark');beam('Scenery_prop',[x,y+1.8,.2],[x,y,3.8],.12,.12,'steel')
# Prepare perspective-corrected visual texture fragments from the user brochure.
# Reuse the saved reference textures so rebuilding needs no separate photo upload.
import shutil
for s,label in [(-1,'left'),(1,'right')]:
 fn='Nightfly_Wall_'+label+'.jpg';shutil.copy(P.parent/'assets'/fn,P/fn)
 mat='art_'+label;colors[mat]=('#ffffff',0,.8);texture_files[mat]=fn;cx=s*3.3
 name='Scenery_art_'+label;v=[[cx-2.65,.735,.96],[cx+2.65,.735,.96],[cx+2.65,.735,5.04],[cx-2.65,.735,5.04]]
 mesh(name,v,[[0,1,2],[0,2,3]],mat);uvs[name]=np.array([[0,1],[1,1],[1,0],[0,0]],float)
# Dimensional marquees, decorative lamps and readable raised type.
def sign(c,w=2.7):
 x,y,z=c
 cyl('Sign_round_back',[x,y+.08,z],[x,y,z],w*.32,'steel',48)
 box('Sign_wings',[x,y-.04,z],[w,.13,w*.33],'steel')
 box('Sign_black_insert',[x,y-.12,z],[w*.93,.035,w*.27],'black')
 text3d('NIGHTFLY',[x,y-.145,z-w*.055],w*.87,w*.13,'signblue')
 text3d('NO GRAVITY',[x,y-.148,z-w*.125],w*.56,w*.051,'yellow')
 for xx in np.arange(x-w*.46,x+w*.46,.13):
  for zz in [z-w*.143,z+w*.143]:lamp('Sign_bulb',[xx,y-.15,zz],front,.03)
 for a in np.linspace(0,2*np.pi,36,endpoint=False):lamp('Sign_ring_bulb',[x+math.cos(a)*w*.29,y-.06,z+math.sin(a)*w*.29],front,.03)
sign([0,-3.64,7.65],2.7)
for x in [-5.8,5.8]:
 cyl('Speaker_tower',[x,-3,.68],[x,-3,5.65],.075,'steel',12)
 box('Speaker_cabinet',[x,-3,4.25],[.55,.4,.83],'black')
 for z in [4.08,4.43]:cyl('Speaker_cone',[x,-3.215,z],[x,-3.24,z],.17,'rubber',20)
 sign([x,-3.0,5.32],2.2)
box('Ticket_marquee',[-4.5,-7.4,2.87],[2.2,.2,.65],'steel')
text3d('TICKETS',[-4.5,-7.52,2.70],1.9,.33,'yellow')
for x in np.arange(-5.48,-3.5,.14):
 for z in [2.60,3.15]:lamp('Ticket_bulb',[x,-7.54,z],front,.034)
# Place the transverse seat axle behind the padded backrests.
for idx,(name,v,f,mat) in enumerate(meshes):
 if name.startswith('Gondola_axle_'):
  k=int(name.rsplit('_',1)[1])-1;rad=np.cos(k*np.pi/2)*U+np.sin(k*np.pi/2)*V;out=np.array([rad[0],rad[1],0]);out/=np.linalg.norm(out)
  meshes[idx]=(name,v-out*.34,f,mat)
# Assign parts before batching, preserving all four independent gondola hinges.
def group_for(name,v):
 c=v.mean(0)
 if name.startswith(('Hydraulic_barrel','Hydraulic_piston','Hydraulic_pin')):return 'hydraulic-source'
 if name.startswith(('Gondola_', 'Shield_', 'Seat_', 'Padded_')):
  if '_Seat_' in name:k=int(name.split('_')[1])-1
  elif name.startswith('Gondola_axle_'):k=int(name.rsplit('_',1)[1])-1
  else:k=int(np.argmin([np.linalg.norm(c-(center+np.array([np.cos(j*np.pi/2),np.sin(j*np.pi/2),0])*2.7)) for j in range(4)]))
  return 'gondola'+str(k)
 if name.startswith(('Crown','Nightfly_enclosed','Nightfly_Y','Spoke_')):return 'crown'
 if name.startswith(('Rotor_passenger','Rotor_counterweight','Counterweight','Rotor_LED','Rotor_bulb','Rotor_black')):return 'rotor'
 if name.startswith(('Hubarm','Main_pin','Pin_cap','Rotor_drive','Maintenance','Gear_tooth')):return 'lift'
 if name.startswith(('Sign_','Lettering_NIGHTFLY','Lettering_NO GRAVITY')) and c[2]>6:return 'lift'
 return 'static'
from collections import defaultdict
bucket=defaultdict(list)
for name,v,f,mat in meshes:
 group=group_for(name,v)
 if group=='hydraulic-source':continue
 bucket[(group,name,mat)].append((v,f))
meshes=[];mesh_groups={};new_uv={}
for (group,name,mat),items in bucket.items():
 vv=[];ff=[];offset=0
 for v,f in items:vv.append(v);ff.append(f+offset);offset+=len(v)
 newname=group+'__'+name;meshes.append((newname,np.vstack(vv),np.vstack(ff),mat));mesh_groups[newname]=group
 if name in uvs:new_uv[newname]=uvs[name]
uvs=new_uv
# Export OBJ with linked texture maps.
with open(P/'Nightfly.mtl','w') as f:
 for name,(hx,metal,rough) in colors.items():
  rgb=[int(hx[i:i+2],16)/255 for i in [1,3,5]];f.write(f'newmtl {name}\nKd {rgb[0]} {rgb[1]} {rgb[2]}\nKs .3 .3 .3\nNs 50\n')
  if name in texture_files:f.write('map_Kd '+texture_files[name]+'\n')
  f.write('\n')
with open(P/'Nightfly.obj','w') as f:
 f.write('# Nightfly visual reconstruction; metres; Z up\nmtllib Nightfly.mtl\n');off=1;uvoff=1
 for name,v,faces,mat in meshes:
  f.write(f'o {name}\nusemtl {mat}\n');f.writelines('v %.6f %.6f %.6f\n'%tuple(p) for p in v)
  if name in uvs:
   f.writelines('vt %.6f %.6f\n'%(q[0],1-q[1]) for q in uvs[name])
   for t in faces:f.write('f '+' '.join(f'{q+off}/{q+uvoff}' for q in t)+'\n')
   uvoff+=len(uvs[name])
  else:f.writelines('f %d %d %d\n'%tuple(t+off) for t in faces)
  off+=len(v)
# Embedded GLB with PBR materials and all artwork bytes.
g={'asset':{'version':'2.0','generator':'Nightfly reference reconstruction'},'scene':0,'scenes':[{'nodes':[]}],'nodes':[],'meshes':[],'materials':[],'buffers':[{}],'bufferViews':[],'accessors':[],'images':[],'textures':[],'samplers':[{'magFilter':9729,'minFilter':9987,'wrapS':33071,'wrapT':33071}]};data=bytearray()
def bv(raw,target=None):
 while len(data)%4:data.append(0)
 item={'buffer':0,'byteOffset':len(data),'byteLength':len(raw)}
 if target:item['target']=target
 g['bufferViews'].append(item);data.extend(raw);return len(g['bufferViews'])-1
for name,(hx,metal,rough) in colors.items():
 rgb=[int(hx[i:i+2],16)/255 for i in [1,3,5]];m={'name':name,'doubleSided':True,'pbrMetallicRoughness':{'baseColorFactor':rgb+[1],'metallicFactor':metal,'roughnessFactor':rough}}
 if name=='light':m['emissiveFactor']=[.85,.78,.54]
 if name in texture_files:
  view=bv((P/texture_files[name]).read_bytes());idx=len(g['images']);g['images'].append({'bufferView':view,'mimeType':'image/jpeg'});g['textures'].append({'source':idx,'sampler':0});m['pbrMetallicRoughness']['baseColorTexture']={'index':idx}
 g['materials'].append(m)
def accessor(arr,typ):
 view=bv(arr.tobytes(),34962);a={'bufferView':view,'componentType':5126,'count':len(arr),'type':typ}
 if typ=='VEC3':a.update(min=arr.min(axis=0).tolist(),max=arr.max(axis=0).tolist())
 g['accessors'].append(a);return len(g['accessors'])-1
for i,(name,v,faces,mat) in enumerate(meshes):
 v=v[:,[0,2,1]];v[:,2]*=-1;vv=v[faces].reshape(-1,3);tri=vv.reshape(-1,3,3);nn=np.cross(tri[:,1]-tri[:,0],tri[:,2]-tri[:,0]);nn/=np.maximum(np.linalg.norm(nn,axis=1)[:,None],1e-12);nn=np.repeat(nn,3,axis=0)
 attrs={'POSITION':accessor(vv.astype('<f4'),'VEC3'),'NORMAL':accessor(nn.astype('<f4'),'VEC3')}
 if name in uvs:attrs['TEXCOORD_0']=accessor(uvs[name][faces].reshape(-1,2).astype('<f4'),'VEC2')
 g['meshes'].append({'name':name,'primitives':[{'attributes':attrs,'material':list(colors).index(mat)}]});g['nodes'].append({'name':name,'mesh':i});g['scenes'][0]['nodes'].append(i)
g['buffers'][0]['byteLength']=len(data);js=json.dumps(g,separators=(',',':')).encode();js+=b' '*((-len(js))%4);data+=b'\0'*((-len(data))%4)
with open(P/'Nightfly_korrigiert.glb','wb') as f:f.write(struct.pack('<III',0x46546c67,2,12+8+len(js)+8+len(data))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(data),0x004e4942)+data)
print(len(meshes),'objects;',sum(len(f) for _,_,f,_ in meshes),'triangles;',len(data),'binary bytes',flush=True)

# Runtime model uses shared indexed vertices; local Z-up scene coordinates.
# Group origins are explicit and all loading-position gondola hinges are horizontal.
import gzip
origins={'static':np.zeros(3),'lift':base,'rotor':pivot,'crown':center}
for k in range(4):origins['gondola'+str(k)]=center+np.array([np.cos(k*np.pi/2),np.sin(k*np.pi/2),0])*2.7
model={'version':1,'units':'metres','up':'Z','origins':{k:v.tolist() for k,v in origins.items()},'hinges':[[float(-np.sin(k*np.pi/2)),float(np.cos(k*np.pi/2)),0] for k in range(4)],'materials':{},'meshes':[]}
for name,(color,metal,rough) in colors.items():
 model['materials'][name]={'color':color,'metalness':metal,'roughness':rough}
 if name in texture_files:model['materials'][name]['map']=texture_files[name]
 if name=='light':model['materials'][name]['emissive']=color
for name,v,f,mat in meshes:
 group=mesh_groups[name];v=v-origins[group]
 item={'name':name,'group':group,'material':mat,'positions':np.round(v,5).reshape(-1).tolist(),'indices':f.reshape(-1).tolist()}
 if name in uvs:item['uv']=uvs[name].reshape(-1).tolist()
 model['meshes'].append(item)
assets=P.parent/'assets';assets.mkdir(exist_ok=True)
with gzip.open(assets/'nightfly.json.gz','wb',compresslevel=9) as f:f.write(json.dumps(model,separators=(',',':')).encode())
import shutil
for fn in texture_files.values():shutil.copy(P/fn,assets/fn)
with gzip.open(assets/'Nightfly_korrigiert.glb.gz','wb',compresslevel=9) as f:f.write((P/'Nightfly_korrigiert.glb').read_bytes())
print('RIG:',len(model['meshes']),'parts;', (assets/'nightfly.json.gz').stat().st_size,'compressed bytes',flush=True)
