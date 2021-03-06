﻿using RemesasJJ;
using RemesasJJ.Logics;
using RemesasJJWebAPP.Filters;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace RemesasJJWebAPP.Controllers
{
    public class FormController : Controller
    {
        // GET: Form
        Remesa remex = new Remesa();
        Bancos bancos = new Bancos();
        Change change = new Change();
        RemesasJJ.Logics.SendGrid sendMail = new RemesasJJ.Logics.SendGrid();
       
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult form2()
        {
            return View();
        }
        public ActionResult form3()
        {
            return View();
        }
        public ActionResult form4()
        {
            return View();
        }
        public JsonResult uploadFileClient(HttpPostedFileBase File)
        {

          
            try
            {
                var imageAcept = false;
                  string fileName;
                  string ext = Path.GetExtension(File.FileName);

                if (ext == ".gif" || ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext==".jpe")
                {
                    imageAcept = true;

                }
           

               
                if (imageAcept == true)
                {
                    var g = Guid.NewGuid().ToString().Replace(@"-", "");
                    fileName = g + ext;
                    UploadClientFiles(File, fileName);
                    return Json(new { estatus = true, filename = fileName });
                }
                else
                {
                    return Json(new { message = "El Archivo no puede ser procesado", estatus = false });
                }
               
               
            }
            catch (Exception ex)
            {
                return Json(new {message=ex.Message,estatus=false});
            }

                       

        }
        // GET: Form/Details/5
        [HttpPost]
        public JsonResult Bancos()
        {
            object bancox;
            using (remesasEntities remete = new remesasEntities())
            {
                remete.Configuration.ProxyCreationEnabled = false;
                bancox = remete.bancos.ToList();
            }
            
            return Json(bancox);
        }

        // GET: Form/Create
        [HttpPost]
        public async Task<JsonResult> Enviar(remesas remesa, string file)
        {

            if (remesa.id != 0)
            {
                try
                {
                    remesa.editadaPor = int.Parse(HttpContext.User.Identity.Name);
                    remesa.file = file;
                    remex.Update(remesa);
                    remex.Save();
                }catch(Exception ex)
                {
                    return Json(new { message = ex.Message, estatus = false });
                }
               

            }
            else { 

            try
            {
                remesa.CreadaPor = int.Parse(HttpContext.User.Identity.Name);
                remesa.file = file;
                remesa.estatus = 1;
                remesa.cambioid = change.GetActualChange().id;
                remesa.paisDestino = 1;
              //  remesa.fecha = DateTime.Now;
                remex.Insert(remesa);
                remex.Save();
                var bacon=bancos.GetByID((int)remesa.bancoBenef);
                

                var content = "<div>" +
                               "<h1 style = 'color:darkseagreen'> ENVIO REALIZADO</h1>" +
                               "<p style = 'text-align:justify'>" +
                               "Hola <strong style='color:darkseagreen'>"+
                               remesa.nombreCliente+
                               "</strong>, se ha realizado el envió de la información sin problemas, El Código de tu Remesa es"+
                               "<strong style='color:darkseagreen'>#"+remesa.id+"</strong>, usa este número para solventar cualquier problema que pudiera presentarse." +
                               "Los tiempos de entrega de la remesa pueden variar de acuerdo a la hora y el día que se realice la transacción.Trabajamos eficientemente para que estos tiempos sean los más cortos posible." +
                               "Estaremos informando a tu correo electrónico cuando la transacción se realice.</p>"+
                               "<p>Beneficiario:</p>"+"<strong>"+ remesa.nombreBenef +"</strong>"+
                               "<p>Cedula:</p>" + "<strong>" + remesa.cedulaBenef + "</strong>" +
                               "<p>Banco:</p>" + "<strong>" + bacon.nombre + "</strong>" +
                               "<p>Cuenta:</p>" + "<strong>" + remesa.cuentaBenef + "</strong>" +
                               "<p>Monto:</p>" + "<strong>" + string.Format ("{0:N}",remesa.montoDeposito) + "</strong>" +
                               "<p>Total Enviado:</p>" + "<strong>" + string.Format("{0:N}", remesa.montoDestino)  + "</strong>" +


                               "</div>";

                JsonResult x = await SendMail("Datos de Envio Recibidos", "remesasjj@remesasjj.com", "Remesasjj", remesa.correoCliente, remesa.nombreCliente, content);
               
            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, estatus = false,  });
            }
            }
            return Json( new {estatus=true, nombre=remesa.nombreCliente,codigo=remesa.id});
        }
        [HttpPost]
        public async Task<JsonResult> EnviarProc(int remesaID)
        {
            var remesa = remex.GetByID(remesaID);
            try
            {
               
                var bacon = bancos.GetByID((int)remesa.bancoBenef);


                var content = "<div>" +
                               "<h1 style = 'color:darkseagreen'> ENVIO PROCESADO</h1>" +
                               "<p style = 'text-align:justify'>" +
                               "Hola <strong style='color:darkseagreen'>" +
                               remesa.nombreCliente +
                               "</strong>, se ha Procesado tu Remesa, El Código de tu Remesa es " +
                               "<strong style='color:darkseagreen'>#" + remesa.id + "</strong>"+
                               "<p>Beneficiario:</p>" + "<strong>" + remesa.nombreBenef + "</strong>" +
                               "<p>Cedula:</p>" + "<strong>" + remesa.cedulaBenef + "</strong>" +
                               "<p>Banco:</p>" + "<strong>" + bacon.nombre + "</strong>" +
                               "<p>Cuenta:</p>" + "<strong>" + remesa.cuentaBenef + "</strong>" +
                               "<p>Monto:</p>" + "<strong>" + string.Format("{0:N}", remesa.montoDeposito) + "</strong>" +
                               "<p>Total Enviado:</p>" + "<strong>" + string.Format("{0:N}", remesa.montoDestino) + "</strong>" +
                               "<p>Imagen del Reporte:</p>" + "<img src ='http://www.remesasjj.com/content/uploads/" + remesa.imgTrans + "'>" + 
                                  "<a href='http://www.remesasjj.com/content/uploads/" + remesa.imgTrans + "'>Imagen</a> " +


                               "</div>";

                JsonResult x = await SendMail("Remesa Procesada", "remesasjj@remesasjj.com", "Remesasjj", remesa.correoCliente, remesa.nombreCliente, content);

            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, estatus = false });
            }

            return Json(new { estatus = true, nombre = remesa.nombreCliente, codigo = remesa.id });
        }

        [HttpPost]
        public async Task<JsonResult> SendMail(string subjectx, string fromF, string fromName, string toF, string toName, string content)
        {
            //StreamReader reader = new StreamReader("~/Content/m.txt");
            var apiKey = sendMail.GetKey();
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(fromF, fromName);

            var subject = subjectx;
            var to = new EmailAddress(toF, toName);
            var htmlContent = content;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, "", content);
            var response = await client.SendEmailAsync(msg);


            return Json(response.StatusCode.ToString());
        }
        [HttpPost]
        public JsonResult SendMailService (string subjectx, string fromF,string key, string fromName, string toF, string toName, string content)
        {

            var existe = remex.context.sendgrid.Where(x => x.usuarioEmail == fromF && x.key == key);

            if (existe.Count() == 0)
            {
                return Json(new { error=true,message="No Autorizado",response=false});

            }
            
            //StreamReader reader = new StreamReader("~/Content/m.txt");
            var apiKey = sendMail.GetKey();
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(fromF, fromName);

            var subject = subjectx;
            var to = new EmailAddress(toF, toName);
            var htmlContent = content;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, "", content);
            client.SendEmailAsync(msg).Wait();

            return Json(new { error = false, message = "Correo enviado", response = client.SendEmailAsync(msg).Result });
            
        }
        // POST: Form/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Form/Edit/5
        public ActionResult message()
        {
            return View();
        }

        public ActionResult Error()
        {
            return View();
        }
        // POST: Form/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Form/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }
        public string UploadClientFiles(HttpPostedFileBase fileData, string filename)
        {

            var filenamex = filename;
            var filePathOriginal = Server.MapPath("/Content/Uploads");
            string savedFileName = Path.Combine(filePathOriginal, filename);
            fileData.SaveAs(savedFileName);
            return "Upload File Complete";

        }
        // POST: Form/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
