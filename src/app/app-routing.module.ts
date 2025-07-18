import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  
{

    'path': '',
    loadComponent: () =>
        import('./module/dashboard/dashboard.component').then(
            (mod) => mod.DashboardComponent
        ),canActivate: [authGuard] // Protect this route
},
{

    'path': 'dashboard',
    loadComponent: () =>
        import('./module/dashboard/dashboard.component').then(
            (mod) => mod.DashboardComponent
        ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'login', loadComponent: () => import('./module/login/login.component').then((mod) => mod.LoginComponent ),
},
{
    'path': 'account', loadComponent: () => import('./module/account/account.component').then((mod) => mod.AccountComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'signup', loadComponent: () => import('./module/signup/signup.component').then((mod) => mod.SignupComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'security', loadComponent: () => import('./module/security/security.component').then((mod) => mod.SecurityComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'firewall', loadComponent: () => import('./module/firewall/firewall.component').then((mod) => mod.FirewallComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'groups', loadComponent: () => import('./module/groups/groups.component').then((mod) => mod.GroupsComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'demo', loadComponent: () => import('./module/demo/demo.component').then((mod) => mod.DemoComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'managers', loadComponent: () => import('./module/managers/managers.component').then((mod) => mod.ManagersComponent ),canActivate: [authGuard] // Protect this route,
},

{
    'path': 'real', loadComponent: () => import('./module/real/real.component').then((mod) => mod.RealComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'client-accounts', loadComponent: () => import('./module/client-accounts/client-accounts.component').then((mod) => mod.ClientAccountsComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'clients', loadComponent: () => import('./module/clients/clients.component').then((mod) => mod.ClientsComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'client-managers', loadComponent: () => import('./module/client-managers/client-managers.component').then((mod) => mod.ClientManagersComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'trading-accounts', loadComponent: () => import('./module/trading-accounts/trading-accounts.component').then((mod) => mod.TradingAccountsComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'order-&-deals', loadComponent: () => import('./module/order-deals/order-deals.component').then((mod) => mod.OrderDealsComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'position', loadComponent: () => import('./module/position/position.component').then((mod) => mod.PositionComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'orders', loadComponent: () => import('./module/orders/orders.component').then((mod) => mod.OrdersComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'deals', loadComponent: () => import('./module/deals/deals.component').then((mod) => mod.DealsComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'data-feeds', loadComponent: () => import('./module/data-feeds/data-feeds.component').then((mod) => mod.DataFeedsComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'data-feeds-inner', loadComponent: () => import('./module/data-feeds-inner/data-feeds-inner.component').then((mod) => mod.DataFeedsInnerComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'symbols', loadComponent: () => import('./module/symbols/symbols.component').then((mod) => mod.SymbolsComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'charts-&-ticks', loadComponent: () => import('./module/charts-ticks/charts-ticks.component').then((mod) => mod.ChartsTicksComponent ),canActivate: [authGuard] // Protect this route
},

{
    'path': 'minuts-history-chart', loadComponent: () => import('./module/minuts-history-chart/minuts-history-chart.component').then((mod) => mod.MinutsHistoryChartComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'bid-ask-last-ticks', loadComponent: () => import('./module/bid-ask-last-ticks/bid-ask-last-ticks.component').then((mod) => mod.BidAskLastTicksComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'synchronization', loadComponent: () => import('./module/synchronization/synchronization.component').then((mod) => mod.SynchronizationComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'analytics-trading-accounts', loadComponent: () => import('./module/analytics-trading-accounts/analytics-trading-accounts.component').then((mod) => mod.AnalyticsTradingAccountsComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'online-user', loadComponent: () => import('./module/online-user/online-user.component').then((mod) => mod.OnlineUserComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'open-position', loadComponent: () => import('./module/open-position/open-position.component').then((mod) => mod.OpenPositionComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'open-order', loadComponent: () => import('./module/open-order/open-order.component').then((mod) => mod.OpenOrderComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'advertising-campaigns', loadComponent: () => import('./module/advertising-campaigns/advertising-campaigns.component').then((mod) => mod.AdvertisingCampaignsComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'by-country', loadComponent: () => import('./module/by-country/by-country.component').then((mod) => mod.ByCountryComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'server-reports', loadComponent: () => import('./module/server-reports/server-reports.component').then((mod) => mod.ServerReportsComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'clients-and-orders', loadComponent: () => import('./module/clients-and-orders/clients-and-orders.component').then((mod) => mod.ClientsAndOrdersComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'co-online-user', loadComponent: () => import('./module/co-online-user/co-online-user.component').then((mod) => mod.CoOnlineUserComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'co-client', loadComponent: () => import('./module/co-client/co-client.component').then((mod) => mod.CoClientComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'co-trading-account', loadComponent: () => import('./module/co-trading-account/co-trading-account.component').then((mod) => mod.CoTradingAccountComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'co-position', loadComponent: () => import('./module/co-position/co-position.component').then((mod) => mod.CoPositionComponent ),canActivate: [authGuard] // Protect this route
},
{
    'path': 'co-orders', loadComponent: () => import('./module/co-orders/co-orders.component').then((mod) => mod.CoOrdersComponent ),canActivate: [authGuard] // Protect this route
},
{ path: '**', redirectTo: 'login', pathMatch: 'full' },
{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
