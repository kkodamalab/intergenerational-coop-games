export const DEFAULT_COLORS = {p1:'#d94e4e',p2:'#367bc6',puck:'#000000'};
export type HockeyColors = typeof DEFAULT_COLORS;
export const PALETTE = [
 ['赤','#d94e4e'],['青','#367bc6'],['緑','#3b945b'],['黄','#ffdf3d'],
 ['オレンジ','#f58a32'],['紫','#8a56b3'],['ピンク','#ed83b2'],['白','#ffffff'],['黒','#000000']
] as const;
export const COLOR_STORAGE_KEY='intergenerational-hockey-colors';
export function loadColors(storage:Pick<Storage,'getItem'>):HockeyColors {
 const colors={...DEFAULT_COLORS};
 try {const saved=JSON.parse(storage.getItem(COLOR_STORAGE_KEY)||'null');
 for(const key of Object.keys(colors) as (keyof HockeyColors)[])
 if(typeof saved?.[key]==='string'&&/^#[0-9a-f]{6}$/i.test(saved[key]))colors[key]=saved[key];
 }catch {/* Storage may be unavailable or contain an older/invalid value. */}
 return colors;
}
export function labelColor(hex:string){const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));return rgb[0]*.299+rgb[1]*.587+rgb[2]*.114>155?'#172b3a':'#ffffff';}
export function gameDuration(value:number){return Number.isFinite(value)?Math.max(10,Math.min(60,Math.round(value))):30;}
