using Newtonsoft.Json;
using RemesasJJ;
using RemesasJJ.Logics;
using RemesasJJWebAPP.Filters;
using RemesasJJWebAPP.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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
        public Usuarios usuariosx = new Usuarios();
        
        public ActionResult Index()
        {
            return View();
        }
        [CustAuthFilter]
        public ActionResult Bancos()
        {
            return View();
        }
        [CustAuthFilter]
        public ActionResult Roles()
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
        [CustAuthFilter]
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
        public JsonResult GetRole(int id)
        {
            roles role;
            try
            {
                change.context.Configuration.ProxyCreationEnabled = false;
               role= change.context.roles.FirstOrDefault(x => x.id == id);
            }
            catch (Exception ex)
            {
                return Json(new { estatus = false });
            }
            return Json(role);

        }
        [HttpPost]
        public JsonResult GetUserAcess(int id)
        {
            object roleAcess;
            try
            {
                change.context.Configuration.ProxyCreationEnabled = false;
                roleAcess = change.context.roleacess.Where(x => x.roleid == id).ToList();
            }
            catch (Exception ex)
            {
                return Json(new { estatus = false });
            }
            return Json(roleAcess);

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
        public JsonResult GetAccesos()
        {
            var data = Bancosx.context.acesos.ToList().Select(x => new {
                id = x.id,
                nombre = x.nombre,
                active = x.active
            });

            return Json(data);

        }
        [HttpPost]
        public JsonResult getAllRoles()
        {
            var data = Bancosx.context.roles.ToList().Select(x => new {
                id = x.id,
                name = x.name,
                
            });

            return Json(data);

        }
        [HttpPost]
        public JsonResult deleteRoles(int id)
        {

            try
            {
                var roleDelete = Bancosx.context.roles.FirstOrDefault(x => x.id == id);
                Bancosx.context.roles.Remove(roleDelete);
                Bancosx.context.SaveChanges();

            }catch (Exception ex)
            {
                return Json(new { error = true });
            }

            return Json(new {estatus=true});

        }
        [HttpPost]
        public JsonResult SaveRoles(List<acesos> accesos,roles rol, int? id=null)
        {

            if (id != null) {


                Bancosx.context.roleacess.RemoveRange(Bancosx.context.roleacess.Where(x => x.roleid == id));
                Bancosx.context.SaveChanges();
                foreach (var item in accesos)
                {
                    if (item.active == 1)
                    {
                        roleacess rolito = new roleacess();
                        rolito.roleid = (int) id;
                        rolito.acesosid = item.id;

                        Bancosx.context.roleacess.Add(rolito);

                    }

                }
                Bancosx.context.SaveChanges();

            }
            else

            { 
                
            try
            {
                Bancosx.context.roles.Add(rol);
                Bancosx.context.SaveChanges();


                foreach (var item in accesos)
                {
                    if (item.active == 1)
                    {
                        roleacess rolito = new roleacess();
                        rolito.roleid = rol.id;
                        rolito.acesosid = item.id;

                        Bancosx.context.roleacess.Add(rolito);

                    }

                }
                Bancosx.context.SaveChanges();
            }catch (Exception ex)
            {
                return Json(new { error = true, estatus = false });
            }
            }

            return Json(new { estatus = true });

        }
        [HttpPost]
        public JsonResult Getusuarios()
        {
            var users = usuariosx.GetAll().ToList().Select(x => new {
               x.id,
               x.nombre,
               x.correo,
               x.nombrex,
               rolName=x.roles==null ?"":x.roles.name

            });

            return Json(users);

        }
        [HttpPost]
        public JsonResult saveUser(users user)
        {
            try
            {
                if (user.id == 0)
                {
                    user.fecha = DateTime.Now;
                    usuariosx.Insert(user);
                    
                }
                else
                {
                    usuariosx.Update(user);
                }
                usuariosx.Save();

            }
            catch(Exception ex)
            {
                return Json(new { error = true });
            }

            return Json(new {estatus=true});

        }

        [HttpPost]
        public JsonResult EliminarUser(users user)
        {
            try
            {
                usuariosx.Delete(user.id);
                usuariosx.Save();

            }
            catch
            {
                return Json(new { error = true });
            }

            return Json(new { estatus = true });

        }
        [CustAuthFilter]
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
        [CustAuthFilter]
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

            var currentUser=usuariosx.context.users.FirstOrDefault(x => x.nombre == usuario.userName);

            if (currentUser!=null && usuario.password.Equals(currentUser.clave))
            {
                FormsAuthentication.SetAuthCookie(currentUser.id.ToString(), true);
                return Json(new { estatus = true });
            }


            return Json(new { estatus = false });

        }
        public ActionResult Logout()
        {

            FormsAuthentication.SignOut();




            return RedirectToAction("index","admin");
        }

        // POST: Admin/Create
        [CustAuthFilter]
        public ActionResult usuarios()
        {

            return View();

        }

        public ActionResult Homes()
        {
           
                return View();
            
        }

        // GET: Admin/Edit/5
        [CustAuthFilter]
        public ActionResult Cambio()
        {
            cambio cambio = new cambio();
            ViewBag.cambio = JsonConvert.SerializeObject(cambio);
            return View();
        }

        // POST: Admin/Edit/5
        


        // POST: Admin/Delete/5
      
    }
}
