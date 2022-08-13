var express = require('express');
var ejs = require('ejs');
var mysql = require('mysql');
var bp = require('body-parser');
//var session = require('express-session');
var app=express();

app.use(express.static('/public'));
app.set('view engine','ejs');

var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'bus_management'
});

app.listen(3000);
app.use(bp.urlencoded({extends:true}));
app.use(express.static(__dirname + "/public"));
app.use(express.static("."));



//routes

app.get('/',function(req,res){
    return res.render('index');   
});
app.get('/ads',function(req,res){
    return res.render('index');   
});
app.get('/admin',function(req,res){
    return res.render('Admin');   
});
app.get('/student',function(req,res){
    return res.render('Student');   
});
app.get('/driver',function(req,res){
    return res.render('Driver');   
});
app.get('/about',function(req,res){
    return res.render('index');   
});
app.get('/contact',function(req,res){
    return res.render('index');   
});

app.post('/register-student',(req,res)=>{
    var name=req.body.names;
    var email=req.body.emails;
    var pass=req.body.passs;
    var contact=req.body.contacts;
    
    var sql=`INSERT INTO students_details(Name,Email_Address,password,Contact_No) VALUES('${name}','${email}+','${pass}','${contact}');`;
    
    con.query(sql,(error,result)=>{
        res.redirect('/schedule');
    })
});
app.post('/register-driver',(req,res)=>{
    var name=req.body.names;
    var email=req.body.emails;
    var pass=req.body.passs;
    var contact=req.body.contacts;
    
    var sql=`INSERT INTO driver_details(Name,Email_Address,password,Contact_No) VALUES('${name}','${email}+','${pass}','${contact}');`;
    
    con.query(sql,(error,result)=>{
        if(error){
            res.send(error)
        }
        else{
            res.redirect(`/driver/${email}`);
        }   
    })
});

app.post('/register-final-driver',(req,res)=>{
    var name=req.body.names;
    var email=req.body.emails;
    var pass=req.body.passs;
    var contact=req.body.contacts;
    var id;
    con.query(`SELECT COUNT(*) AS n FROM driver_details`,(e,r)=>{
        id=r[0].n+1;
    });
    
    var sql=`INSERT INTO driver_details(Driver_ID,Name,Email_Address,password,Contact_No) VALUES(${id},'${name}','${email}+','${pass}','${contact}');`;
    
    con.query(sql,(error,result)=>{
        if(error){
            res.send(error)
        }
        else{
            res.redirect(`/driver/schedule/${id}`);
        }   
    })
});
app.get('/driver/schedule/:id',(req,res)=>{
    var id=req.params.id;
    con.query(`SELECT * FROM bus_schedule JOIN driver_details ON bus_schedule.Driver_ID=driver_details.Driver_ID WHERE Driver_ID='${id}'`,(e,r)=>{
        return res.render('Schedule',{
        schedule:r
    });
    }) 
})

app.get('/driver/:email',(req,res)=>{
    return res.render('Driver-final.ejs');
});

app.get('/schedule',(req,res)=>{
    con.query('SELECT * FROM bus_schedule JOIN driver_details ON bus_schedule.Driver_ID=driver_details.Driver_ID',(e,r)=>{
        return res.render('Schedule',{
        schedule:r
    });
    })    
});



app.post('/home',function(req,res){
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
app.post('/student-login',function(req,res){
    var email=req.body.emaill;
    var pass=req.body.passl;
    con.query(`SELECT * FROM students_details WHERE Email_Address='${email}' AND password='${pass}'`,(e,r)=>{
        if(r){
            return res.render('/schedule');
        }
        else{
            return res.redirect('back');
        }
    })
});
app.post('/driver-login',function(req,res){
    var email=req.body.emaill;
    var pass=req.body.passl;
    con.query(`SELECT * FROM driver_details WHERE Email_Address='${email}' AND password='${pass}'`,(e,r)=>{
        if(r){
            return res.render('/driver/schedule/:id');
        }
        else{
            return res.redirect('back');
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
