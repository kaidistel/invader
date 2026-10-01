export const HOTKEYS=[
{"key": "o", "action": "restraints-open", "label": "O", "description": "Alle Bügel öffnen"},
{"key": "l", "action": "restraints-close", "label": "L", "description": "Alle Bügel schließen"},
{"key": "c", "action": "restraints-toggle", "label": "C", "description": "Bügel auf / zu umschalten"},
  {
    "key": "u",
    "action": "raise",
    "label": "U",
    "description": "Fahrstellung anheben"
  },
  {
    "key": "j",
    "action": "lower",
    "label": "J",
    "description": "In Ladestellung zurückfahren"
  },
  {
    "key": "a",
    "action": "left",
    "label": "A",
    "description": "Gondelkreuz links (−12 U/min)"
  },
  {
    "key": "s",
    "action": "right",
    "label": "S",
    "description": "Gondelkreuz rechts (+12 U/min)"
  },
  {
    "key": "d",
    "action": "rotor-stop",
    "label": "D",
    "description": "Gondelkreuz stoppen"
  },
  {
    "key": "q",
    "action": "rpm-down",
    "label": "Q",
    "description": "Drehzahl −0,5 U/min"
  },
  {
    "key": "e",
    "action": "rpm-up",
    "label": "E",
    "description": "Drehzahl +0,5 U/min"
  },
  {
    "key": "w",
    "action": "pendulum",
    "label": "W",
    "description": "Pendelprogramm"
  },
  {
    "key": "h",
    "action": "arm-hold",
    "label": "H",
    "description": "Arm sanft anhalten"
  },
  {
    "key": "y",
    "action": "loop-left",
    "label": "Y",
    "description": "Überschläge links"
  },
  {
    "key": "x",
    "action": "loop-right",
    "label": "X",
    "description": "Überschläge rechts"
  },
  {
    "key": "arrowleft",
    "action": "manual-left",
    "label": "←",
    "description": "Arm manuell links (halten)"
  },
  {
    "key": "arrowright",
    "action": "manual-right",
    "label": "→",
    "description": "Arm manuell rechts (halten)"
  },
  {
    "key": "+",
    "action": "power-up",
    "label": "+",
    "description": "Antriebsleistung +5 %"
  },
  {
    "key": "-",
    "action": "power-down",
    "label": "−",
    "description": "Antriebsleistung −5 %"
  },
  {
    "key": "r",
    "action": "release",
    "label": "R",
    "description": "Alle Gondeln frei"
  },
  {
    "key": "b",
    "action": "brake",
    "label": "B",
    "description": "Alle Gondeln festbremsen"
  },
  {
    "key": "v",
    "action": "brake-toggle",
    "label": "V",
    "description": "Alle Gondelbremsen umschalten"
  },
  {
    "key": "1",
    "action": "gondola-0",
    "label": "1",
    "description": "Bremse Gondel 1"
  },
  {
    "key": "2",
    "action": "gondola-1",
    "label": "2",
    "description": "Bremse Gondel 2"
  },
  {
    "key": "3",
    "action": "gondola-2",
    "label": "3",
    "description": "Bremse Gondel 3"
  },
  {
    "key": "4",
    "action": "gondola-3",
    "label": "4",
    "description": "Bremse Gondel 4"
  },
  {
    "key": "p",
    "action": "pause",
    "label": "P",
    "description": "Pause / weiter"
  },
  {
    "key": " ",
    "action": "estop",
    "label": "Leertaste",
    "description": "Not-Halt"
  },
  {
    "key": "0",
    "action": "reset",
    "label": "0",
    "description": "Simulation zurücksetzen"
  },
  {
    "key": "5",
    "action": "camera-orbit",
    "label": "5",
    "description": "Kamera Übersicht"
  },
  {
    "key": "6",
    "action": "camera-front",
    "label": "6",
    "description": "Kamera Front"
  },
  {
    "key": "7",
    "action": "camera-seat",
    "label": "7",
    "description": "Mitfahrkamera"
  },
  {
    "key": "n",
    "action": "night",
    "label": "N",
    "description": "Abendlicht umschalten"
  },
  {
    "key": "f1",
    "action": "help",
    "label": "F1",
    "description": "Tastenübersicht öffnen / schließen"
  },
  {
    "key": "escape",
    "action": "help-close",
    "label": "Esc",
    "description": "Hilfe schließen"
  }
];
export function shortcutFor(event,helpOpen=false){
 if(event.ctrlKey||event.metaKey||event.altKey)return null;
 const key=event.key.toLowerCase();
 if(helpOpen&&!['escape','f1',' '].includes(key))return null;
 const target=event.target;
 if(target?.matches?.('textarea,select,[contenteditable="true"],input:not([type="range"])')&&key!==' ')return null;
 if(target?.matches?.('input[type="range"]')&&key.startsWith('arrow'))return null;
 const binding=HOTKEYS.find(b=>b.key===key);
 if(!binding)return null;
 if(event.repeat&&!['rpm-down','rpm-up','power-down','power-up'].includes(binding.action))return null;
 return binding;
}
