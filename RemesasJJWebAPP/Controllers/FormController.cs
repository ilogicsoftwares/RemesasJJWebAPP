using RemesasJJ;
using RemesasJJ.Logics;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace RemesasJJWebAPP.Controllers
{
    public class FormController : Controller
    {
        // GET: Form
        Remesa remex = new Remesa();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult uploadFileClient(HttpPostedFileBase File)
        {

            string fileName;
            try
            {
                var extension = Path.GetExtension(File.FileName);

                var g = Guid.NewGuid().ToString().Replace(@"-", "");
                fileName= g + extension;
                UploadClientFiles(File, fileName);
               
            }
            catch (Exception ex)
            {
                return Json(new {estatus=false});
            }




            return Json(new { estatus = true, filename= fileName });

        }
        // GET: Form/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Form/Create
        [HttpPost]
        public JsonResult Enviar(remesas remesa, string file)
        {
            try
            {
                remesa.file = file;
                remesa.estatus = 1;
                remesa.paisDestino = 1;
                remesa.fecha = DateTime.Now;
                remex.Insert(remesa);
                remex.Save();
            }
            catch (Exception ex)
            {
                return Json(new { estatus = false });
            }
            
            return Json( new {estatus=true });
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
        public ActionResult Edit(int id)
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
         

            // Get the object used to communicate with the server.  
            FtpWebRequest request = (FtpWebRequest)WebRequest.Create("ftp://remesasjj.com/remesasjj.com/uploads/" + filename);
            request.Method = WebRequestMethods.Ftp.UploadFile;

            // This example assumes the FTP site uses anonymous logon.  
            request.Credentials = new NetworkCredential("popestmaster", "Nicole1721#");

            // Copy the contents of the file to the request stream.  
            BinaryReader sourceStream = new BinaryReader(fileData.InputStream);
            byte[] fileContents = sourceStream.ReadBytes(fileData.ContentLength);
            sourceStream.Close();
            request.ContentLength = fileContents.Length;

            Stream requestStream = request.GetRequestStream();
            requestStream.Write(fileContents, 0, fileContents.Length);
            requestStream.Close();

            FtpWebResponse response = (FtpWebResponse)request.GetResponse();



            response.Close();
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
