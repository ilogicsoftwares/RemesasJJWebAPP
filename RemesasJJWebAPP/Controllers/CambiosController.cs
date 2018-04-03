using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using RemesasJJ.Logics;
using RemesasJJ;

namespace RemesasJJWebAPP.Controllers
{
    public class CambiosController : Controller
    {
        // GET: Cambios
        public Change cambios = new Change();
        public ActionResult Index()
        {
            return View();
        }

        // GET: Cambios/Details/5
        public JsonResult Get()
        {
            var cambiox= cambios.GetActualChange();
            return Json(cambiox,JsonRequestBehavior.AllowGet);
        }

        // GET: Cambios/Create
        [HttpPost]
        public JsonResult Create(cambio cambio)
        {
            try {
                cambios.Insert(cambio);
                cambios.Save();
                return Json(new { estatus = true });
            }catch(Exception ex)
            {
            
                return Json(new { estatus = false});
            }
            
        }

        // POST: Cambios/Create
      

        // GET: Cambios/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Cambios/Edit/5
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

        // GET: Cambios/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Cambios/Delete/5
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
