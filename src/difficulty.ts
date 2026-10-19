import {hockeyStep,type Puck,type Point} from './physics';
export const MULTIPLIER_STORAGE_KEY='intergenerational-difficulty';
export const MULTIPLIERS={
 fallSpeed:{label:'落下速度',min:.5,max:3,step:.1},
 fallAmount:{label:'落下物の数',min:.5,max:3,step:.25},
 puckSpeed:{label:'球の速度',min:.5,max:2.5,step:.1},
} as const;
export type MultiplierKey=keyof typeof MULTIPLIERS;
export type DifficultyMultipliers=Record<MultiplierKey,number>;
export const DEFAULT_MULTIPLIERS:DifficultyMultipliers={fallSpeed:1,fallAmount:1,puckSpeed:1};
export function validMultiplier(key:MultiplierKey,value:unknown){
 const {min,max,step}=MULTIPLIERS[key];
 if(typeof value!=='number'||!Number.isFinite(value))return 1;
 return Number((min+Math.round((Math.max(min,Math.min(max,value))-min)/step)*step).toFixed(2));
}
export function loadMultipliers(storage:Pick<Storage,'getItem'>):DifficultyMultipliers{
 const result={...DEFAULT_MULTIPLIERS};try{const saved=JSON.parse(storage.getItem(MULTIPLIER_STORAGE_KEY)||'null');for(const key of Object.keys(result) as MultiplierKey[])result[key]=validMultiplier(key,saved?.[key]);}catch{}return result;
}
// Remaining spawn time is in baseline seconds. Changing the multiplier preserves
// progress toward the next spawn; at 1 this is exactly the original countdown.
export const advanceSpawn=(remaining:number,dt:number,amount:number)=>remaining-dt*amount;
// Store velocities in baseline units, never multiply them cumulatively.
// The collision solver sees real velocities, including unchanged paddle velocity.
export function scaledHockeyStep(p:Puck,pads:(Point&{vx:number,vy:number})[],radius:number,dt:number,maxSpeed:number,multiplier:number){
 if(multiplier===1)return hockeyStep(p,pads,radius,dt,maxSpeed);
 const m=validMultiplier('puckSpeed',multiplier);
 const actual={...p,vx:p.vx*m,vy:p.vy*m};
 // At most 8 world units per collision step, below the puck's 24-unit diameter.
 const steps=Math.max(1,Math.ceil(Math.max(maxSpeed*m,Math.hypot(actual.vx,actual.vy))*dt/8));
 let goal=0;for(let i=0;i<steps;i++){goal=hockeyStep(actual,pads,radius,dt/steps,maxSpeed*m);if(goal)break;}
 p.x=actual.x;p.y=actual.y;p.vx=actual.vx/m;p.vy=actual.vy/m;return goal;
}
