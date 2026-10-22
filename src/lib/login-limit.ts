// Process-local bounded limiter; Supabase's own Auth limits remain in force.
export class LoginLimiter {
 private entries=new Map<string,{count:number;at:number}>();
 allow(key:string,maximum:number,now=Date.now()){
  if(this.entries.size>=1000)for(const [id,v] of this.entries)if(now-v.at>=60000)this.entries.delete(id);
  const previous=this.entries.get(key),current=previous&&now-previous.at<60000?previous:null;
  if(current&&current.count>=maximum||!previous&&this.entries.size>=1000)return false;
  this.entries.set(key,{at:current?.at??now,count:(current?.count??0)+1});return true;
 }
}
export const loginLimiter=new LoginLimiter();
