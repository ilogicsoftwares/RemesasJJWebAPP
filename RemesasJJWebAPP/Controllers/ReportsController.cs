using RemesasJJ;
using RemesasJJ.Logics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RemesasJJWebAPP.Controllers
{
    public class ReportsController : Controller
    {
        Remesa remesax = new Remesa();
        Change cambio = new Change(); 
        // GET: Reports
        public ActionResult Index()
        {
            return View();
        }

        // GET: Reports/Details/5
        public ActionResult GeneralRemesas()
        {
            return View();
        }

        // GET: Reports/Create
        [HttpPost]
        public JsonResult RemesasTotales(string fecha)
        {
            var xFecha=DateTime.Parse(fecha);
            var remesas=remesax.GetByFecha(xFecha);
            var filter = remesas.Where(x => x.estatus1.id < 3).Select(x => new
            {
                estatus = x.estatus1.id,
                bancoEmpreId = x.bancosempre != null ? x.bancosempre.id : 7,
                montoDeposito = x.montoDeposito,
                moneda = x.monedaDeposito,
                fecha = x.fecha,
                banco = x.remesaType == 1 ? "EFECTIVO " +x.moneda.sing  : x.bancosempre != null ? x.bancosempre.nombre : "NO PROCESADO",
                cuenta= x.bancosempre!= null ? x.bancosempre.cuentaNumero : "",
                sing =x.moneda.sing,
                cambio=x.cambio.cambio1,
                enviado=x.montoDestino
               


            });
            var TotalEnviado = filter.Where(x => x.estatus == 2).Sum(x => x.enviado);
            var Group = filter.
                GroupBy(x => new { x.banco , x.moneda } ).
                Select(cl => new {
                      cl.FirstOrDefault().bancoEmpreId,
                      total=cl.Sum(x=>x.montoDeposito),
                      cl.Key.moneda,
                      cl.FirstOrDefault().cuenta,
                      cl.FirstOrDefault().fecha,
                      cl.Key.banco,
                      cl.FirstOrDefault().sing,
                      cl.FirstOrDefault().cambio
                    

                }).OrderBy(x=>x.bancoEmpreId).ToList();
            var Totales = Group.Select(x => new
            {
                moneda = x.moneda,
                total = x.total,
                sing = x.sing,
                cambio = x.cambio
               
            });
            var cambioActual = cambio.GetActualChange(xFecha);
            var totalGen =Totales.Sum(x => x.total) /(decimal) cambioActual.cambio1 ;
          
            var totalx=Totales.GroupBy(x => x.moneda).
            Select(gr => new {
                moneda = gr.FirstOrDefault().moneda,
                total = gr.Sum(x => x.total),
                sing=gr.FirstOrDefault().sing,
                cambio=gr.FirstOrDefault().cambio

            });
            
               
            return Json(new {subTotal= Group,
                             total =totalx,
                             totalGen = totalGen,
                             totalEnv =TotalEnviado,
                             fecha =xFecha.ToShortDateString(),
                             cambio =cambioActual.cambio1,
                             precioCompra=cambioActual.bolivares
                            
            });
        }

        // POST: Reports/Create
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

        // GET: Reports/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Reports/Edit/5
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

        // GET: Reports/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Reports/Delete/5
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
