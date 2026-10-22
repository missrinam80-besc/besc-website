import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LoginLimiter} from '../src/lib/login-limit.ts';
test('Login limits reset at expiry and keep password and link budgets separate',()=>{
 const l=new LoginLimiter();for(let i=0;i<5;i++)assert(l.allow('password:TESTFIXTURE',5,1000));assert(!l.allow('password:TESTFIXTURE',5,1001));assert(l.allow('link:TESTFIXTURE',1,1001));assert(!l.allow('link:TESTFIXTURE',1,1002));assert(l.allow('password:TESTFIXTURE',5,61000));
});
test('Full limiter refuses new keys temporarily and frees capacity after expiry',()=>{
 const l=new LoginLimiter();for(let i=0;i<1000;i++)assert(l.allow('TESTFIXTURE-'+i,5,1000));assert(!l.allow('TESTFIXTURE-new',5,1001));assert(l.allow('TESTFIXTURE-new',5,61000));
});
