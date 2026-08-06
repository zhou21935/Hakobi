import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateKeyPair, SignJWT } from 'jose'
import { buildApp } from './app.js'
const config={supabaseUrl:'https://test.supabase.co',databaseUrl:'postgresql://test:test@localhost/test',corsOrigin:'http://localhost:5173',port:3000}
const apps:Array<Awaited<ReturnType<typeof buildApp>>>=[]
afterEach(async()=>{await Promise.all(apps.splice(0).map(app=>app.close()))})
async function fixture(){const{privateKey,publicKey}=await generateKeyPair('RS256');const query=vi.fn().mockResolvedValue({rows:[],rowCount:0});const app=await buildApp(config,{getKey:vi.fn().mockResolvedValue(publicKey),pool:{query,end:vi.fn()} as never});apps.push(app);const token=await new SignJWT({role:'authenticated'}).setProtectedHeader({alg:'RS256',kid:'test'}).setSubject('00000000-0000-4000-8000-000000000001').setIssuer(`${config.supabaseUrl}/auth/v1`).setAudience('authenticated').setIssuedAt().setExpirationTime('5m').sign(privateKey);return{app,token,query}}
describe('HTTP API',()=>{
 it('has public health and protected orders',async()=>{const{app}=await fixture();expect((await app.inject({method:'GET',url:'/health'})).json()).toEqual({status:'ok'});const r=await app.inject({method:'GET',url:'/api/orders'});expect(r.statusCode).toBe(401);expect(r.json().error.code).toBe('AUTH_UNAUTHORIZED')})
 it('passes the verified subject',async()=>{const{app,token,query}=await fixture();const r=await app.inject({method:'GET',url:'/api/orders',headers:{authorization:`Bearer ${token}`}});expect(r.json()).toEqual({data:[],meta:{count:0}});expect(query).toHaveBeenCalledWith(expect.any(String),['00000000-0000-4000-8000-000000000001'])})
 it('rejects malformed ids and identity injection',async()=>{const{app,token}=await fixture();const headers={authorization:`Bearer ${token}`};expect((await app.inject({method:'GET',url:'/api/orders/nope',headers})).statusCode).toBe(400);const r=await app.inject({method:'POST',url:'/api/orders',headers,payload:{category:'agent',name:'Book',amount:1,productCategories:['book'],userId:crypto.randomUUID()}});expect(r.statusCode).toBe(400)})
 it('does not leak unexpected errors',async()=>{const{app,token,query}=await fixture();const logError=vi.spyOn(app.log,'error');query.mockRejectedValueOnce(new Error('postgresql://admin:secret@internal/sql'));const r=await app.inject({method:'GET',url:'/api/orders',headers:{authorization:`Bearer ${token}`}});expect(r.statusCode).toBe(500);expect(r.body).not.toMatch(/secret|postgresql|admin@/i);expect(logError).toHaveBeenCalledWith({errType:'Error'},'Unhandled request error')})
})

