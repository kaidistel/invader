const assert=require('node:assert/strict');const Q=require('./quality.js');
for(const room_name of ['Bed in 6-Bed Dormitory','Bunk bed in mixed dorm','Shared Double Room','Mehrbettzimmer','Bett im Schlafsaal','Standard Room','Room','Unknown','Private Room with Shared Bathroom'])assert.equal(Q.isPrivate({room_name}),false,room_name);
for(const room_name of ['Standard Apartment','Single Room','Doppelzimmer','Deluxe Double Room','Superior Twin','Studio','Junior Suite'])assert.equal(Q.isPrivate({room_name}),true,room_name);
assert.equal(Q.isPrivate({room_name:'Double Room',is_shared:true}),false);
assert.equal(Q.isPrivate({room_name:'Room',is_private:true}),true);
assert.equal(Q.isPrivate({room_name:'Bed in Dorm',is_private:true}),false);
const rooms=Q.privateRooms({currency:'EUR',room_options:[{room_name:'Dormitory',price:20},{room_name:'Double Room',price:300},{room_name:'Standard Apartment',price:240},{room_name:'Studio',price:100,currency:'USD'},{room_name:'Single Room',price:0}]});assert.equal(rooms.length,2);assert.equal(rooms[0].price,240);
const q=Q.extras({direct:false,segments:[{from:'DUS',to:'FRA',arrival_time:'2026-12-11T09:00:00+01:00',aircraft_type:'Airbus A320'},{from:'FRA',to:'MLA',departure_time:'2026-12-11T11:30:00+01:00'}]});assert.equal(q.segments[0].aircraft,'Airbus A320');assert.deepEqual(q.layovers,[{airport:'FRA',minutes:150}]);assert.equal(Q.extras({direct:false}).layovers.length,0);assert.equal(Q.timediff('2026-12-11T09:00:00','2026-12-11T10:00:00'),null);
console.log('Private-room exclusion, price selection, and layover/aircraft fixtures passed');
