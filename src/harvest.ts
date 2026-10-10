import {type Fruit,fruitStep,type board} from './physics';
export const HAZARD_PROBABILITY=.25;
export const HARVEST_ITEMS=[
 {id:'chestnut',name:'栗',radius:19,speed:115,points:10,hazard:false},
 {id:'pear',name:'梨',radius:21,speed:95,points:20,hazard:false},
 {id:'persimmon',name:'柿',radius:20,speed:130,points:15,hazard:false},
 {id:'pumpkin',name:'カボチャ',radius:29,speed:100,points:30,hazard:false},
 {id:'sweet-potato',name:'サツマイモ',radius:23,speed:125,points:20,hazard:false},
 {id:'apple',name:'リンゴ',radius:22,speed:110,points:20,hazard:false},
 {id:'mandarin',name:'ミカン',radius:17,speed:140,points:10,hazard:false},
 {id:'radish',name:'大根',radius:28,speed:105,points:25,hazard:false},
 {id:'mushroom',name:'毒キノコ',radius:23,speed:120,points:-20,hazard:true},
 {id:'spider',name:'クモ',radius:23,speed:140,points:-10,hazard:true},
 {id:'snake',name:'蛇',radius:25,speed:130,points:-15,hazard:true},
] as const;
export function chooseItem(difficulty:number,random:()=>number=Math.random){
 const hazard=difficulty===2&&random()<HAZARD_PROBABILITY;
 const indexes=HARVEST_ITEMS.map((item,i)=>({item,i})).filter(({item})=>item.hazard===hazard);
 return indexes[Math.min(indexes.length-1,Math.floor(random()*indexes.length))].i;
}
export function makeFruit(kind:number,x:number):Fruit {const item=HARVEST_ITEMS[kind];return {x,y:-item.radius,r:item.radius,vy:item.speed,kind,s:0,v:0,held:0,caught:false,done:false};}
export function harvestStep(f:Fruit,p:ReturnType<typeof board>,dt:number,speed:number){
 const item=HARVEST_ITEMS[f.kind];
 const scored=fruitStep(f,p,dt,speed,item.hazard);
 return scored?item.points:0;
}
// All drawings fit the same circle radius used by the collision calculation.
export function drawHarvestItem(ctx:CanvasRenderingContext2D,f:Fruit){
 const item=HARVEST_ITEMS[f.kind];ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.r/30,f.r/30);
 const ellipse=(x:number,y:number,rx:number,ry:number,color:string,angle=0)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,angle,0,Math.PI*2);ctx.fill();};
 const line=(points:number[][],color:string,width=3)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
 const leaf=()=>{line([[0,-16],[2,-25]],'#725139',3);ellipse(9,-20,9,4,'#588346',-.4);};
 switch(item.id){
 case 'chestnut':ellipse(0,1,24,24,'#8e4e28');ellipse(0,15,20,8,'#dbaf80');break;
 case 'pear':ellipse(0,7,23,21,'#b7c654');ellipse(0,-9,14,15,'#b7c654');leaf();break;
 case 'persimmon':ellipse(0,3,25,22,'#eb862c');leaf();break;
 case 'pumpkin':ellipse(0,3,27,23,'#e47b2d');for(const x of [-12,0,12])ellipse(x,3,9,22,x===0?'#f59a37':'#e98730');leaf();break;
 case 'sweet-potato':ellipse(0,1,28,14,'#985876',-.45);line([[-18,9],[14,-7]],'#df9e9d',2);break;
 case 'apple':ellipse(-8,3,17,22,'#d95b4f');ellipse(8,3,17,22,'#d95b4f');leaf();break;
 case 'mandarin':ellipse(0,3,25,22,'#f89823');ellipse(0,-18,5,3,'#69934a');break;
 case 'radish':ellipse(0,6,12,22,'#fffefa',-.22);line([[-3,26],[0,29]],'#d8cfb0',2);for(const x of [-12,0,12])line([[0,-12],[x,-26]],'#62994e',5);line([[0,8],[8,6]],'#cdc6ab',2);break;
 case 'mushroom':ellipse(0,13,9,14,'#fff1c7');ellipse(0,-5,27,17,'#de4846');for(const [x,y] of [[-13,-7],[2,-14],[15,-3],[-1,2]])ellipse(x,y,4,4,'white');break;
 case 'spider':for(const side of [-1,1])for(const y of [-12,0,12])line([[side*8,0],[side*20,y],[side*26,y+7]],'#675284',3);ellipse(0,1,15,18,'#9c7bc0');break;
 case 'snake':line([[-20,15],[-10,7],[3,13],[15,4],[8,-7]],'#75a64d',12);ellipse(6,-12,13,10,'#96bd6e');break;
 }
 const eyeY=item.id==='snake'?-13:item.id==='mushroom'?14:5;
 const eyeX=item.id==='snake'?6:0;
 for(const x of [-6,6])ellipse(eyeX+x,eyeY,2,3,'#3f3542');
 line([[eyeX-3,eyeY+7],[eyeX,eyeY+9],[eyeX+3,eyeY+7]],'#574351',1.8);
 ctx.restore();
}
