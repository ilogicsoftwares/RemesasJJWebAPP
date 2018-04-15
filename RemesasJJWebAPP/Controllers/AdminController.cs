using Newtonsoft.Json;
using RemesasJJ;
using RemesasJJ.Logics;
using RemesasJJWebAPP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace RemesasJJWebAPP.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin
        public Change change = new Change();
        public ActionResult Index()
        {
            return View();
        }

        // GET: Admin/Details/5
        [Authorize]
        public ActionResult Desktop()
        {
            ViewBag.cambio = JsonConvert.SerializeObject(new cambio()); 
            return View();
        }
        [HttpPost]
        public JsonResult saveChange(cambio cambio)
        {
            try
            {
                change.Insert(cambio);
                change.Save();
            }
            catch(Exception ex)
            {
                return Json(new { estatus = false });
            }
            return Json(new { estatus = true });

        }
        // GET: Admin/Create
        [HttpPost]
        public ActionResult Login(User usuario)
        {
            if (usuario.userName=="admin" && usuario.password == "admin1721")
            {
                FormsAuthentication.SetAuthCookie(usuario.userName, true);
            }

            

            return Json(new {estatus=true});
        }
        public ActionResult Logout()
        {

            FormsAuthentication.SignOut();




            return RedirectToAction("index","admin");
        }

        // POST: Admin/Create

        public ActionResult Homes()
        {
           
                return View();
            
        }

        // GET: Admin/Edit/5
        public ActionResult Cambio()
        {
            cambio cambio = new cambio();
            ViewBag.cambio = JsonConvert.SerializeObject(cambio);
            return View();
        }

        // POST: Admin/Edit/5
        

        // GET: Admin/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Admin/Delete/5
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
