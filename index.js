var express = require('express');
var ejs = require('ejs');
var mysql = require('mysql');
var bp = require('body-parser');
//var session = require('express-session');
var app=express();

app.use(express.static('/public'));
app.set('view engine','ejs');

function connection(){
    return mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'sample'
    });
}

app.listen(8000);
app.use(bp.urlencoded({extends:true}));
app.use(express.static(__dirname + "/public"));
app.use(express.static("."));



//routes

app.get('/',function(req,res){
    return res.render('index',);   
});
app.post('/home',function(req,res){
    var con=connection();
    var email=req.body.email;
    var pass=req.body.pass;
    var sql="SELECT id FROM users WHERE email='"+email+"' AND password='"+pass+"'";

    con.query(sql,function(error,result){
        if(result){
            return res.render('home');
        }
        else{
            return res.send('invalid email or password');
        }
    })  
});

app.get('/login',function(req,res){
    return res.render('login');
});

app.get('/register',function(req,res){
    return res.render('register');
});
app.post('/registration',function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var pass=req.body.pass;
    var cpass=req.body.cpass;
    var con=connection();
    var sql="INSERT INTO users(name,email,password) VALUES('"+name+"','"+email+"','"+pass+"');";
    
    con.query(sql,(error,result)=>{
        res.redirect('/login');
    })
});

app.get('/users',function(req,res){
    var con=connection();
    con.query('SELECT * FROM users',function(e,result){
        return res.render('users',{
            users:result
        });
    })
    
});
app.get('/user/edit/:id',function(req,res){
    var id=req.params.id;
    var con=connection();
    var sql="SELECT * FROM users WHERE id="+id;
    con.query(sql,function(e,result){
        return res.render('user',{
            user:result
        });
    });
});
app.get('/user/delete/:id',function(req,res){
    var id=req.params.id;
    var con=connection();
    var sql="DELETE FROM users WHERE id="+id;
    con.query(sql,function(e,result){
        return res.redirect('back');
    });
});
app.post('/update-user',function(req,res){
    var id=req.body.id;
    var email=req.body.email;
    var name=req.body.name;
    var pass=req.body.pass;
    var con=connection();
    var sql="UPDATE users SET name = '"+name+"', email = '"+email+"' , password = '"+pass+"' WHERE id="+id;
    
    con.query(sql,function(e,result){
        return res.redirect('back');
    })
});
