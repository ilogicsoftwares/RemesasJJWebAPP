using RemesasJJ;
using RemesasJJ.Logics;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace RemesasJJWebAPP
{
    public static class PropertyCopier<TParent, TChild> where TParent : class
                                            where TChild : class
    {
        public static void Copy(TParent parent, TChild child)
        {
            var parentProperties = parent.GetType().GetProperties();
            var childProperties = child.GetType().GetProperties();

            foreach (var parentProperty in parentProperties)
            {
                foreach (var childProperty in childProperties)
                {
                    if (parentProperty.Name == childProperty.Name && parentProperty.PropertyType == childProperty.PropertyType)
                    {
                        childProperty.SetValue(child, parentProperty.GetValue(parent));
                        break;
                    }
                }
            }
        }
    }
    public class MenuRoles : Controller
    {
        Remesa remex = new Remesa();
        public bool Testrole(int? rolid, string ActionNamex)
        {


            var allAcces = remex.context.roleacess.Include("acesos").Where(x=>x.roleid==rolid).ToList();


                var busca = allAcces.FirstOrDefault(x=>x.acesos.link == ActionNamex);
                if (busca!= null)
                {
                    return true;
                }
           

            return false;
        }

    }
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
           
        }
    }
}
