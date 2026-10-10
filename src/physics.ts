export type Point={x:number,y:number};
export const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export function board(a:Point,b:Point,length:number,maxAngle:number){
 const angle=clamp((b.y-a.y)*maxAngle,-maxAngle,maxAngle);
 const dx=Math.cos(angle)*length/2,dy=Math.sin(angle)*length/2;
 const x=clamp(500+(a.x+b.x)*180,dx+24,976-dx),y=clamp(490+(a.y+b.y)*110,100+Math.abs(dy),670-Math.abs(dy));
 return {x,y,angle,length,left:{x:x-dx,y:y-dy},right:{x:x+dx,y:y+dy}};
}
export type Fruit={x:number,y:number,r:number,vy:number,kind:number,s:number,v:number,held:number,caught:boolean,done:boolean};
export function fruitStep(f:Fruit,p:ReturnType<typeof board>,dt:number,speed:number,penaltyOnContact=false){
 if(f.done)return false;
 const c=Math.cos(p.angle),sn=Math.sin(p.angle);
 if(!f.caught){
 const old=(f.y-p.y)*c-(f.x-p.x)*sn;f.y+=f.vy*speed*dt;
 const n=(f.y-p.y)*c-(f.x-p.x)*sn,s=(f.x-p.x)*c+(f.y-p.y)*sn;
 if(old<=-f.r && n>=-f.r && Math.abs(s)<=p.length/2){f.caught=true;f.s=s;f.held=0;if(penaltyOnContact){f.done=true;return true;}}
 if(f.y>760)f.done=true;
 }
 if(f.caught){f.v+=500*sn*dt;f.v*=Math.exp(-1.4*dt);f.s+=f.v*dt;
 f.x=p.x+f.s*c+f.r*sn;f.y=p.y+f.s*sn-f.r*c;
 if(Math.abs(f.s)>p.length/2){f.done=true;return false;}
 f.held+=dt;if(f.held>=1){f.done=true;return true;}}
 return false;
}
export type Puck=Point&{vx:number,vy:number};
export function hockeyStep(p:Puck,pads:(Point&{vx:number,vy:number})[],radius:number,dt:number,maxSpeed:number){
 p.x+=p.vx*dt;p.y+=p.vy*dt;
 if(p.x<222){p.x=222;p.vx=Math.abs(p.vx);}if(p.x>778){p.x=778;p.vx=-Math.abs(p.vx);}
 for(const pad of pads){const dx=p.x-pad.x,dy=p.y-pad.y,d=Math.hypot(dx,dy),r=radius+12;
 if(d<r){const nx=d?dx/d:0,ny=d?dy/d:1;p.x=pad.x+nx*r;p.y=pad.y+ny*r;
 const rel=(p.vx-pad.vx)*nx+(p.vy-pad.vy)*ny;
 if(rel<0){p.vx-=1.8*rel*nx;p.vy-=1.8*rel*ny;}}}
 const v=Math.hypot(p.vx,p.vy),scale=Math.min(1,maxSpeed/(v||1))*Math.exp(-.12*dt);p.vx*=scale;p.vy*=scale;
 if(p.y<42||p.y>658){if(p.x>410&&p.x<590)return p.y<42?1:2;p.y=clamp(p.y,42,658);p.vy=p.y===42?Math.abs(p.vy):-Math.abs(p.vy);}
 return 0;
}
