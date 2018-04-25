using RemesasJJ;
using RemesasJJ.Logics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RemesasJJWebAPP.Controllers
{
    public class RemesasController : Controller
    {
        // GET: Remesas
        Remesa remesax = new Remesa();
        Bancos banco = new Bancos();
        public ActionResult Index()
        {
            return View();
        }

        // GET: Remesas/Details/5
        [HttpPost]
        public JsonResult GetAll()
        {
             var remesas = remesax.GetAll();
            var remex = remesas.Select(x => new {
                x.id,
                fecha = x.fecha.Value.ToShortDateString(),
                x.nombreCliente,
                x.moneda.sing,
                x.monedaDeposito,
                montoDeposito = x.moneda.sing + String.Format("{0:N}", x.montoDeposito),
                montoDepositoN = x.montoDeposito,
                x.nombreBenef,
                x.cedulaBenef,
                montoDestino = "Bs." + String.Format("{0:N}", x.montoDestino),
                montoDestinoN =  x.montoDestino,
                x.cuentaBenef,
                banco = x.bancos.nombre,
                estatus = x.estatus1.estatus1,
                img=x.file,
                tipo=x.remesatype1.descripcion
                
                         

            });
             return Json(remex);
        }

        // GET: Remesas/Create
        public JsonResult BancosEmpre()
        {
            var bancos = banco.GetAllEmpre().Select(x=>new {
                nombre=x.nombre,
                id=x.id,
                cuenta=x.cuentaNumero
            });
            return Json(bancos);
        }

        // POST: Remesas/Create
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

        // GET: Remesas/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Remesas/Edit/5
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

        // GET: Remesas/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Remesas/Delete/5
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
