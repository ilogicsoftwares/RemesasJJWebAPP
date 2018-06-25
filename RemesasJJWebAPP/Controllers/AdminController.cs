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
using static RemesasJJWebAPP.MvcApplication;

namespace RemesasJJWebAPP.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin
        public Change change = new Change();
        public Bancos Bancosx = new Bancos();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Bancos()
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
        [HttpPost]
        public JsonResult GetBancosEmpre(int bancoType)
        {
            object moneda;

            if (bancoType == 2)
            {
                 moneda = Bancosx.GetAllEmpre().Select(x => new {
                    id = x.id,
                    nombre = x.nombre,
                    cuentaNumero = x.cuentaNumero,
                    tipoCuenta = x.cuentastype.nombre,
                    moneda = x.moneda.nombre,
                    x.cuentaTrans

                });

            }
            else
            {
                   moneda = Bancosx.context.bancostrans.Select(x => new {
                    id = x.id,
                    nombre = x.nombre,
                    cuentaNumero = x.cuentaNumero,
                    tipoCuenta = x.cuentastype.nombre,
                    moneda = x.moneda.nombre,
                    x.cuentaTrans

                });

            }


            return Json(moneda);

        }
        [HttpPost]
        public JsonResult GetBancos()
        {
            var moneda = Bancosx.GetAll().Select(x => new {
                id = x.id,
                nombre = x.nombre,
                cuentaNumero = x.cuentaNumero
            });

            return Json(moneda);

        }
        [HttpPost]
        public JsonResult SaveBancos(bancosempre banco)
        {
            try
            {
                switch (banco.cuentaTrans)
                {
                    case 1:
                        var banquito = new bancos();
                        banquito.nombre = banco.nombre;
                        banquito.cuentaType = 1;
                        Bancosx.Insert(banquito);
                        Bancosx.Save();
                        break;
                    case 2:
                        Bancosx.context.bancosempre.Add(banco);
                        Bancosx.context.SaveChanges();
                        break;
                    case 3:
                        var banquero = new bancostrans();
                        PropertyCopier<bancosempre, bancostrans>.Copy(banco, banquero);

                        Bancosx.context.bancostrans.Add(banquero);
                        Bancosx.context.SaveChanges();
                        break;

                }


                if (banco.cuentaTrans <= 1)
                {
                   
                }
                else
                {
                    
                }
                
                

            }catch(Exception ex)
            {
                return Json(new { estatus = false });
            }
            

            return Json(new { estatus = true });

        }
        [HttpPost]
        public JsonResult DelBanco(bancosempre banco)
        {
            try
            {
                if (banco.cuentaTrans <= 1)
                {

                    Bancosx.Delete(banco.id);
                    Bancosx.Save();
                }
                else
                {
                    var banco2 =Bancosx.context.bancosempre.FirstOrDefault(x => x.id == banco.id);
                    Bancosx.context.bancosempre.Remove(banco2);
                    Bancosx.context.SaveChanges();
                }



            }
            catch (Exception ex)
            {
                return Json(new { estatus = false });
            }


            return Json(new { estatus = true });

        }
        [HttpPost]
        public JsonResult GetCuentas()
        {
            var moneda = change.context.cuentastype.Select(x => new {
                nombre = x.nombre,
                id = x.id
            });

            return Json(moneda);

        }
        [HttpPost]
        public JsonResult GetMonedas()
        {
            var moneda=change.context.moneda.Select(x=>new {
                nombre=x.nombre,
                sing=x.sing,
                id=x.id
            });

            return Json( moneda );

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
