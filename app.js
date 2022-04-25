const express = require('express');
var app = express();
var upload = require('express-fileupload');
var docxConverter = require('docx-pdf');
var path = require('path');
var fs = require('fs');

//Variables
const extend_pdf = '.pdf'
const extend_docx = '.docx'
var down_name
//use express-fileupload
app.use(upload());

//This will route the root page with index.html
app.get('/',function(req,res){
  res.sendFile(__dirname+'/convert.html');
})
//Post the upload file
app.post('/upload',function(req,res){
  console.log(req.files);
  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    //File where .docx will be downloaded  
    var uploadpath = __dirname + '/uploads/' + name;
    //Name of the file --ex test,example
    const First_name = name.split('.')[0];
    //Name to download the file
    down_name = First_name;
    //.mv function will be used to move the uploaded file to the
    //upload folder temporarily
    file.mv(uploadpath,function(err){
      if(err){
        console.log(err);
      }else{
        //Path of the downloaded or uploaded file
        var initialPath = path.join(__dirname, `./uploads/${First_name}${extend_docx}`);
        //Path where the converted pdf will be placed/uploaded
        var upload_path = path.join(__dirname, `./uploads/${First_name}${extend_pdf}`);
        //Converter to convert docx to pdf -->docx-pdf is used
        //If you want you can use any other converter
        //For example -- libreoffice-convert or --awesome-unoconv
        docxConverter(initialPath,upload_path,function(err,result){
        if(err){
          console.log(err);
        }
        console.log('result'+result);
        res.sendFile(__dirname+'/down_html.html')
        });
      }
    });
  }else{
    res.send("No File selected !");
    res.end();
  }
});

app.get('/download', (req,res) =>{
    //This will be used to download the converted file
    res.download(__dirname +`/uploads/${down_name}${extend_pdf}`,`${down_name}${extend_pdf}`,(err) =>{
      if(err){
        res.send(err);
      }else{
        //Delete the files from uploads directory after the use
        console.log('Files deleted');
        const delete_path_doc = process.cwd() + `/uploads/${down_name}${extend_docx}`;
        const delete_path_pdf = process.cwd() + `/uploads/${down_name}${extend_pdf}`;
        try {
          fs.unlinkSync(delete_path_doc)
          fs.unlinkSync(delete_path_pdf)
          //file removed
        } catch(err) {
        console.error(err)
        }
      }
    })
  })
  //Download Page
  app.get('/thankyou',(req,res) => {
      res.sendFile(__dirname+'/thankyou.html')
  })
  //Starting the server at port 3000
  
  app.listen(8080,() => {
      console.log("Server Started at port 3000...");
  })