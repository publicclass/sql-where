/* global describe, it */
var expect = require('expect.js');
var where = require('./index.js');

describe('sql-where',function(){

  it('should return a Where instance',function(){
    expect(where()).to.be.a(where.Where);
  })

  it('should start with empty values and sql',function(){
    expect(where()).to.have.property('values');
    expect(where()).to.have.property('sql','');
  })

  describe('no table',function(){
    it('',function(){
      expect(where().toString()).to.equal(this.test.title);
      expect(where('').toString()).to.equal(this.test.title);
      expect(where({}).toString()).to.equal(this.test.title);
      expect(where(null).toString()).to.equal(this.test.title);
      expect(where(0).toString()).to.equal(this.test.title);
    })

    it('id = 1',function(){
      var q = {id:1};
      expect(where(q).toString()).to.equal(this.test.title);
    })

    it('id = 1 OR type = "photo"',function(){
      var q = [{id:1},{type:'photo'}];
      expect(where(q).toString()).to.equal(this.test.title);
    })

    it('id = 1 AND type = "photo"',function(){
      var q = {id: 1, type: 'photo'};
      expect(where(q).toString()).to.equal(this.test.title);
    })

    it('type IN ("photo","video")',function(){
      var q = {type:['photo','video']};
      expect(where(q).toString()).to.equal(this.test.title);
    })

    it('type != "text"',function(){
      var q = {type:{not:'text'}};
      expect(where(q).toString()).to.equal(this.test.title);
    })

    it('type NOT IN ("text","video")',function(){
      var q = {type:{not:['text','video']}};
      expect(where(q).toString()).to.equal(this.test.title);
    })

    it('type LIKE "te%"',function(){
      var q = {type:{like:'te%'}};
      expect(where(q).toString()).to.equal(this.test.title);
    })

    it('type LIKE error',function(){
      var q = {type:{like:['te%','x']}};
      expect(function(){where(q)}).to.throwError(function(e){
        expect(e).to.be.a(SyntaxError)
      });
    })

    it('type IS NOT NULL',function(){
      var q = {type:{not:null}};
      expect(where(q).toString()).to.equal(this.test.title);
    })

    it('type IS NULL',function(){
      var q = {type:null};
      expect(where(q).toString()).to.equal(this.test.title);
    })
  })

  describe('with table "example"',function(){
    var opts = {table: 'example'};
    it('',function(){
      expect(where('',opts).toString()).to.equal(this.test.title);
      expect(where({},opts).toString()).to.equal(this.test.title);
      expect(where(null,opts).toString()).to.equal(this.test.title);
      expect(where(0,opts).toString()).to.equal(this.test.title);
    })

    it('"example.id" = 1',function(){
      var q = {id:1};
      expect(where(q,opts).toString()).to.equal(this.test.title);
    })

    it('"example.id" = 1 OR "example.type" = "photo"',function(){
      var q = [{id:1},{type:'photo'}];
      expect(where(q,opts).toString()).to.equal(this.test.title);
    })

    it('"example.id" = 1 AND "example.type" = "photo"',function(){
      var q = {id: 1, type: 'photo'};
      expect(where(q,opts).toString()).to.equal(this.test.title);
    })

    it('"example.type" IN ("photo","video")',function(){
      var q = {type:['photo','video']};
      expect(where(q,opts).toString()).to.equal(this.test.title);
    })

    it('"example.type" != "text"',function(){
      var q = {type:{not:'text'}};
      expect(where(q,opts).toString()).to.equal(this.test.title);
    })

    it('"example.type" NOT IN ("text","video")',function(){
      var q = {type:{not:['text','video']}};
      expect(where(q,opts).toString()).to.equal(this.test.title);
    })

    it('"example.type" LIKE "te%"',function(){
      var q = {type:{like:'te%'}};
      expect(where(q,opts).toString()).to.equal(this.test.title);
    })

    it('"example.type" LIKE error',function(){
      var q = {type:{like:['te%','x']}};
      expect(function(){where(q,opts)}).to.throwError(function(e){
        expect(e).to.be.a(SyntaxError)
      });
    })

    it('"example.type" IS NOT NULL',function(){
      var q = {type:{not:null}};
      expect(where(q,opts).toString()).to.equal(this.test.title);
    })

    it('"example.type" IS NULL',function(){
      var q = {type:null};
      expect(where(q,opts).toString()).to.equal(this.test.title);
    })

  })
})
