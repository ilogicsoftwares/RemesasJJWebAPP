using RemesasJJ;
using RemesasJJ.Logics;
using RemesasJJWebAPP.Filters;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RemesasJJWebAPP.Controllers
{
    public class RemesasController : BaseController
    {
        // GET: Remesas
        Remesa remesax = new Remesa();
        Bancos banco = new Bancos();
        Usuarios userx = new Usuarios();

        [Authorize]
        [CustAuthFilter]
        public ActionResult Index()
        {
            return View();
        }

        // GET: Remesas/Details/5
        [HttpPost]
        public JsonResult GetAll(int? id)
        {
            IEnumerable<remesas> remesas;
            var userRolAfiliado = GetCurrentUser().roles.Afiliado;

            if (userRolAfiliado == 1)
            {
                remesas = remesax.GetAll().Where(x => x.procesadaPor == id || x.CreadaPor == id || x.editadaPor==id || x.AnuladaPor==id);
            }else
            {
                remesas = id == null || id == 0 ? remesax.GetAll() : remesax.GetAll().Where(x => x.procesadaPor == id || x.CreadaPor == id);
            }

            

            var remex = remesas.ToList().Select(x => new {
                x.id,
                fecha = x.fecha.Value.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                x.nombreCliente,
                x.moneda.sing,
                x.monedaDeposito,
                montoDeposito = x.moneda.sing + x.montoDeposito.ToString("N", CultureInfo.CreateSpecificCulture("da-DK")),
                montoDepositoN = x.montoDeposito,
                x.nombreBenef,
                cedulaBenef = x.cedulatype.nombre + x.cedulaBenef,
                montoDestino = "Bs." + x.montoDestino.ToString("N", CultureInfo.CreateSpecificCulture("da-DK")),
                montoDestinoN = x.montoDestino,
                x.cuentaBenef,
                banco = x.bancos == null ? null : x.bancos.nombre,
                estatus = x.estatus1.estatus1,
                procesada = x.procesadaPor != null ? "Pros":"",
                estatusId=x.estatus,
                img=x.file,
                tipo=x.remesatype1.descripcion,
                x.ticketSerial,
                x.idtransf,
                x.bancoDeposito,
                x.BancoTrans

            });
             return Json(remex);
        }
        [CustAuthFilter]
        public JsonResult newRemesa(int id)
        {
            if (id == 0)
            {
                return Json(remesax.New());

            }
            remesax.context.Configuration.ProxyCreationEnabled = false;
            return Json(remesax.GetByID(id));

        }
        private users GetCurrentUser()
        {
            return userx.GetByID(int.Parse(HttpContext.User.Identity.Name));
        }
        // GET: Remesas/Create
        public JsonResult CheckSerial(string ticketId)
        {
            var resultado = true;
            var exist= remesax.getByTicketId(ticketId);
            if (exist != null)
                resultado = false;

            return Json(new {state=resultado});
        }
        public JsonResult checkAnulado(int id)
        {
            remesax.context.Configuration.ProxyCreationEnabled = false;
            var exist = remesax.GetByID(id);
            return Json(exist);
        }
        public JsonResult BancosEmpre()
        {
            var bancos = banco.GetAllEmpre().Select(x=>new {
                nombre=x.nombre,
                id=x.id,
                cuenta=x.cuentaNumero
            });
            return Json(bancos);
        }
        public JsonResult BancosTrans()
        {
            var bancos = remesax.context.bancostrans.Select(x => new {
                nombre = x.nombre,
                id = x.id,
                cuenta = x.cuentaNumero
            });
            return Json(bancos);
        }

        // POST: Remesas/Create
        [CustAuthFilter]
        [HttpPost]
        public JsonResult ProcessRemesa(int id, string idDeposito, string idTransf, int idBanco, int BancoTrans, string imgName="")
        {
           var monedaId= banco.GetEmpreByID(idBanco).monedaID;
           var remesaMoneda = remesax.GetByID(id).moneda.id;

            if (monedaId != remesaMoneda)
            {
                return Json(new {msg="La moneda de deposito no conincide con el banco Seleccionado",state=false});
            }

          var process= remesax.processRemesa(id, idDeposito, idTransf, idBanco,BancoTrans);
          var nuevoStatus=  remesax.GetByID(id);
          nuevoStatus.imgTrans = imgName;
            nuevoStatus.procesadaPor = int.Parse(HttpContext.User.Identity.Name);
          remesax.Update(nuevoStatus);
          remesax.Save();
          return Json(new {state=process,newEstatus=nuevoStatus.estatus1.estatus1});
        }

        // GET: Remesas/Edit/5
        [CustAuthFilter]
        [HttpPost]
        public JsonResult Anular(int id, string anulaDetail, bool sendMail=false)
        {
            try
            {


               
                var remesita = remesax.GetByID(id);
                remesita.estatus = 3;
                remesita.AnuladaPor = int.Parse(HttpContext.User.Identity.Name);
                remesita.unulaDetail = anulaDetail;
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
