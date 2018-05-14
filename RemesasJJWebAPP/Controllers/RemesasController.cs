using RemesasJJ;
using RemesasJJ.Logics;
using System;
using System.Collections.Generic;
using System.Globalization;
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
            var remex = remesas.ToList().Select(x => new {
                x.id,
                fecha = x.fecha.Value.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                x.nombreCliente,
                x.moneda.sing,
                x.monedaDeposito,
                montoDeposito = x.moneda.sing + x.montoDeposito.ToString("N",CultureInfo.CreateSpecificCulture("da-DK")),
                montoDepositoN = x.montoDeposito,
                x.nombreBenef,
                cedulaBenef= x.cedulatype.nombre+x.cedulaBenef,
                montoDestino = "Bs." +  x.montoDestino.ToString("N", CultureInfo.CreateSpecificCulture("da-DK")),
                montoDestinoN =  x.montoDestino,
                x.cuentaBenef,
                banco = x.bancos==null ? null: x.bancos.nombre,
                estatus = x.estatus1.estatus1,
                estatusId=x.estatus,
                img=x.file,
                tipo=x.remesatype1.descripcion,
                x.ticketSerial,
                x.idtransf,
                x.bancoDeposito

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
        public JsonResult ProcessRemesa(int id, string idDeposito, string idTransf, int idBanco)
        {
          var process= remesax.processRemesa(id, idDeposito, idTransf, idBanco);
          var nuevoStatus=  remesax.GetByID(id);
          return Json(new {state=process,newEstatus=nuevoStatus.estatus1.estatus1});
        }

        // GET: Remesas/Edit/5
        [HttpPost]
        public JsonResult Anular(int id)
        {
            try
            {
                var remesita = remesax.GetByID(id);
                if (remesita.estatus == 2)
                    return Json(new {state=false});
                remesita.estatus = 3;
                remesax.Update(remesita);
                remesax.Save();
                return Json(new { state = true,newStatus=remesita.estatus1.estatus1});
            }
            catch {
                object x = null;
                return Json(new {state = x});
            }

           
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

        [HttpPost]
        public JsonResult GetEstatus(int id)
        {
            string estatus;
            try
            {
                 estatus= remesax.GetByID(id).estatus1.estatus1;
            }catch(Exception ex)
            {
                return Json(null);
            }
             
            return Json(estatus);
        }

        // POST: Remesas/Delete/5
        [HttpPost]
        public JsonResult GetEst(int id)
        {
          
           var rem = remesax.GetByID(id);
           return Json(new {id=rem.id,
               estatus =rem.estatus1.estatus1,
               ticketSerial=rem.ticketSerial,
               idtransf=rem.idtransf,
               bancoDeposito=rem.bancoDeposito,
               estatusId =rem.estatus});
        }
    }
}
