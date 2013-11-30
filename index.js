
/*
{id: 1} -> 'id = 1'
[{id: 1}, {type: 'photo'}] -> 'id = 1 OR type = "photo"'
{id: 1, type: 'photo'} -> 'id = 1 AND type = "photo"'
{type:['photo','video']} -> 'type IN ("photo","video")'
{type:{not:'text'}} -> 'type != "text"'
{type:{not:['text','video']}} -> 'type NOT IN ("text","video")'
{type:{like:'te%'}} -> 'type LIKE "te%"'
{type:{like:['te%','x']}} -> throw SyntaxError('like does not support []')
*/
module.exports = where;

function where(query,options){
  return new Where(options || {}).parse(query);
}

where.Where = Where;

function Where(options){
  this.table = options.table || '';
  this.values = [];
  this.sql = '';
}

Where.prototype.parse = function(query){
  this.sql = '';
  if( !query ){
    // ignore
  } else if( Array.isArray(query) ){
    this.sql += or(this,query);
  } else if( typeof query == 'object' ){
    this.sql += and(this,query);
  }
  return this;
}

Where.prototype.toString = function(){
  var self = this;
  return this.sql.replace(/\$(\d+)/g,function(r,i){
    return esc(self.values[parseInt(i,10)-1]);
  })
}

function and(where,obj){
  return Object.keys(obj).map(value(where,obj)).join(' AND ');
}

function or(where,arr){
  return arr.map(function(query,i){
    if( Array.isArray(query) ){
      return or(where,query);
    } else if( typeof query == 'object' ){
      return and(where,query);
    } else {
      throw new SyntaxError('OR values must be an object or an array')
    }
  }).join(' OR ');
}

function eq(where,k,v,negated){
  if( Array.isArray(v) ){ // IN
    if( !negated ){
      return t(where,k) + ' IN ('+s(where,v)+')';
    } else {
      return t(where,k) + ' NOT IN ('+s(where,v)+')';
    }
  } else if( v === null ){ // IS NULL / NOT NULL
    if( !negated ){
      return t(where,k) + ' IS NULL';
    } else {
      return t(where,k) + ' NOT NULL';
    }
  } else if( !negated ){
    return t(where,k) + ' = ' + s(where,v);
  } else {
    return t(where,k) + ' != ' + s(where,v);
  }
}

function like(where,k,v){
  return t(where,k) + ' LIKE ' + s(where,v);
}

function value(where,obj){
  return function(k){
    var v = obj[k];
    if( Array.isArray(v) || simple(v) ){
      return eq(where,k,v);
    } else if( typeof v == 'object' ){
      if( has(v,'not') ){
        return eq(where,k,v.not,true);
      } else if( has(v,'like') ){
        if( simple(v.like) ){
          return like(where,k,v.like);
        } else {
          throw new SyntaxError('"like" only supports strings');
        }
      } else {
        throw new SyntaxError('nested objects require "like" or "not"');
      }
    } else {
      throw new SyntaxError('only [], {} and simple values are accepted');
    }
  }
}

function s(where,v){
  return '$'+where.values.push(v);
}

function t(where,k){
  if( where.table ){
    return '"'+where.table+'.'+k+'"';
  } else {
    return k;
  }
}

function has(o,k){
  return Object.prototype.hasOwnProperty.call(o,k);
}

function simple(v){
  return typeof v == 'string' ||
         typeof v == 'boolean' ||
         typeof v == 'number' ||
         typeof v == 'undefined' ||
         v === null;
}

function esc(v){
  if( typeof v == 'number' ){
    return v.toString();
  } else if( typeof v == 'string' ){
    return '"'+v.replace(/"/g,function(){
      return '""';
    })+'"'
  } else if( Array.isArray(v) ){
    return v.map(esc).join(',');
  } else if( v === null || typeof v == 'undefined' ){
    return 'NULL';
  } else {
    throw new Error('not sure how to escape "'+v+'"');
  }
}