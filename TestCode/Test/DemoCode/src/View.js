//加载导出处理类 EXCELEXP
load("exportutils");

//标题列映射定义
var titlemappings = [
    { "field": "qudao", "column": "渠道", "type": "String" },
    { "field": "ziqudao", "column": "子渠道", "type": "String" },
    { "field": "orgaccountcode", "column": "销售组织编码", "type": "String" },
    { "field": "orgaccountname", "column": "销售组织名称", "type": "String" },
    { "field": "storecode", "column": "门店编号", "type": "String" },
    { "field": "storename", "column": "门店名称", "type": "String" },
    { "field": "address", "column": "地址", "type": "String" },
    { "field": "storeplate", "column": "门牌号码", "type": "String" },
    { "field": "referenceobj", "column": "参考地标", "type": "String" },
    { "field": "ka", "column": "零售系统", "type": "String" },
    { "field": "salechannle", "column": "销售渠道", "type": "String" },
    { "field": "channelnature", "column": "渠道性质", "type": "String" },
    { "field": "province", "column": "省份", "type": "String" },
    { "field": "city", "column": "地级市", "type": "String" },
    { "field": "county", "column": "县级市", "type": "String" },
    { "field": "citylevel", "column": "城市级别", "type": "String" },
    { "field": "jobcity", "column": "业务城市", "type": "String" },
    { "field": "jobcitylevel", "column": "业务城市级别", "type": "String" },
    { "field": "area", "column": "面积", "type": "String" },
    { "field": "brand", "column": "销售品牌", "type": "String" },
    { "field": "storetype", "column": "门店类型", "type": "String" },
    { "field": "storelevel", "column": "门店级别", "type": "String" },
    { "field": "usertype", "column": "人员类型", "type": "String" },
    { "field": "usercode", "column": "人员编号", "type": "String" },
    { "field": "orgname", "column": "人员名称", "type": "String" },
    { "field": "role", "column": "角色", "type": "String" },
    { "field": "customerlevel", "column": "客户级别", "type": "String" },
    { "field": "shiptopartycode", "column": "人员所属客户送达方编号", "type": "String" },
    { "field": "shiptopartyname", "column": "人员所属客户送达方名称", "type": "String" },
    { "field": "soldtopartycode", "column": "人员所属客户售达方编号", "type": "String" },
    { "field": "soldtopartyname", "column": "人员所属客户售达方名称", "type": "String" },
    { "field": "presentativecode", "column": "门店负责人编号", "type": "String" },
    { "field": "presentativename", "column": "门店负责人姓名", "type": "String" },
    { "field": "superiorpresentativecode", "column": "上级人员编号", "type": "String" },
    { "field": "superiorpresentativename", "column": "上级人员名称", "type": "String" },
    { "field": "islocated", "column": "是否已定位", "type": "String" },
    { "field": "longitude", "column": "门店经度", "type": "String" },
    { "field": "latitude", "column": "门店维度", "type": "String" },
    { "field": "visitbias", "column": "偏差距离（KM）", "type": "String" },
    { "field": "visitingstatus", "column": "拜访偏差状态", "type": "String" },
    { "field": "open_date", "column": "开店时间", "type": "String" },
    { "field": "close_date", "column": "关店时间", "type": "String" },
    { "field": "areascore", "column": "面积分值", "type": "String" },
    { "field": "salescore", "column": "销售分值", "type": "String" },
    { "field": "importancescore", "column": "重要性分值", "type": "String" },
    { "field": "totalscore", "column": "分值总计", "type": "String" },
    { "field": "mdep_storelevel", "column": "终端管理部门店级别", "type": "String" }

];

//设置标题映射
EXCELEXP.setTitleMapping(titlemappings);

//入参
var inParam = EXCELEXP.getInputParam();

//动态id
var dynamicid = EXCELEXP.dynamicid;

//设置每次分页的大小
EXCELEXP.setPageSize(2000);

String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

var params = {};
//组织ids
var saleareaids = [];

if (!!IN.obj.qudao) {
    try {
        saleareaids = JSON.parse(IN.obj.qudao);
    } catch (e) {
        saleareaids = [];
    }
}

var usertypelist = [];
if (IN.obj.usertype_keypath != '' && IN.obj.usertype_keypath != null) {
    var usertype_keypath = select dickey from pl_dictionary where keypath like { '%'+IN.obj.usertype_keypath + '%'
    } norule;
    if (usertype_keypath != null && usertype_keypath.length > 0) {
        for (var i = 0; i < usertype_keypath.length; i++) {
            usertypelist.push(usertype_keypath[i].dickey + '');
        }
    }
}

var rule_objmaps = [
    {
        "objectmark": "kx_kq_store",
        "tablename": "kx_kq_store",
        "alias": "store",
    },
    {
        "objectmark": "pl_salearea",
        "tablename": "pl_orgstruct",
        "alias": "pl_orgstruct",
    }
]

var tableName = 'export_objs_table' + dynamicid;
var rule_extraparam = {};
var params = {};
var rule_res = SQL.getRuleSql("kx_kq_store", rule_objmaps, rule_extraparam);

//合并参数
if (rule_res != null && rule_res.rule_param != null) {
    for (var key in rule_res.rule_param) {
        rule_res.where_sql = rule_res.where_sql.replaceAll(":" + key, "'" + rule_res.rule_param[key] + "'");
    }
}

var pageQuerySql = "with brandheadtable as (SELECT bi.customerid,string_agg(DISTINCT ui.jobnumber, ',') AS jobnumber,string_agg(DISTINCT ui.userinfoname, ',') AS presentativename FROM kx_store_brandsell_info AS bi LEFT JOIN pl_orgstruct AS brandhead ON brandhead.orgstructid = bi.brandhead AND brandhead.platstatus = 1 LEFT JOIN pl_userinfo AS ui ON ui.userinfoid = brandhead.userinfoid AND ui.platstatus = 1 WHERE bi.platstatus = 1 group by bi.customerid)";

pageQuerySql += "SELECT id_generator() as id,  split_part(org.fullname,'/',2) as qudao, case when split_part(org.fullname,'/',2) = '母婴渠道' then split_part(org.fullname,'/',3) else '' end as ziqudao, po.orgaccountcode, po.orgname AS orgaccountname, store.storecode, store.storename, store.address, store.storeplate, store.referenceobj, ka.kasystemname AS ka, salechannel.dicvalue AS salechannle, channelnature.dicvalue AS channelnature, split_part(pr.namepath,'.',2) as province, split_part(pr.namepath,'.',3) as city, split_part(pr.namepath,'.',4) as county, pr.citylevel, pr.jobcity, pr.jobcitylevel, store.area, (SELECT string_agg(brandinfo.dicvalue, ',') AS brand FROM kx_store_brandsell_info AS bi LEFT JOIN pl_dictionary AS brandinfo ON brandinfo.dickey = bi.brandid AND brandinfo.platstatus = 1 WHERE bi.customerid = store.id AND bi.platstatus = 1) AS brand, ks.dicvalue AS storetype, storelevel.dicvalue as storelevel, usertype.dicvalue AS usertype, userinfo.jobnumber AS usercode, member.orgname AS orgname,pos.orgname as role, customerlevel.dicvalue as customerlevel,(select uship.channelcode AS shiptopartycode from ka_kq_channelcustomers AS uchannel LEFT JOIN ka_kq_channelcustomers AS uship ON uship.channelcode = userinfo.ship AND uship.crm_orgcode = uchannel.crm_orgcode AND uship.platstatus = 1 where uchannel.id = userinfo.channel AND uchannel.platstatus = 1 limit 1) as shiptopartycode,(select uship.channelname AS shiptopartyname from ka_kq_channelcustomers AS uchannel LEFT JOIN ka_kq_channelcustomers AS uship ON uship.channelcode = userinfo.ship AND uship.crm_orgcode = uchannel.crm_orgcode AND uship.platstatus = 1 where uchannel.id = userinfo.channel AND uchannel.platstatus = 1 limit 1) AS shiptopartyname, (select uchannel.channelcode AS soldtopartycode from ka_kq_channelcustomers AS uchannel where uchannel.id = userinfo.channel AND uchannel.platstatus = 1 limit 1) as soldtopartycode, (select uchannel.channelname AS soldtopartyname from ka_kq_channelcustomers AS uchannel where uchannel.id = userinfo.channel AND uchannel.platstatus = 1 limit 1) AS soldtopartyname, brandheadtable.jobnumber AS presentativecode, brandheadtable.presentativename AS presentativename, su.jobnumber AS superiorpresentativecode, su.userinfoname AS superiorpresentativename, CASE WHEN (SELECT kva.userid FROM kx_visit_actual kva WHERE kva.customerid = store.id AND EXISTS (SELECT 1 FROM kx_kq_storeinandout inout WHERE inout.signintime IS NOT NULL AND inout.signouttime IS NOT NULL AND inout.storeid = kva.customerid AND inout.submitterid = kva.userid AND to_char(kva.actualvisittime, 'yyyy-MM-dd') = to_char(inout.signintime, 'yyyy-MM-dd') AND to_char(kva.actualvisittime, 'yyyy-MM-dd') = to_char(inout.signouttime, 'yyyy-MM-dd')) LIMIT 1) IS NOT NULL OR store.validlocationstatus = 1 THEN '是' ELSE '否' END AS islocated, store.longitude, store.latitude, (SELECT kx_kq_storeinandout.visitbias FROM kx_kq_storeinandout AS kx_kq_storeinandout WHERE kx_kq_storeinandout.storeid = store.id AND kx_kq_storeinandout.platstatus = 1 ORDER BY kx_kq_storeinandout.signintime DESC LIMIT 1) AS visitbias, (SELECT CASE WHEN kx_kq_storeinandout.vsitingstatus = 1 THEN '正常' WHEN kx_kq_storeinandout.vsitingstatus = 0 THEN '异常' ELSE '' END AS vsitingstatus FROM kx_kq_storeinandout AS kx_kq_storeinandout WHERE kx_kq_storeinandout.storeid = store.id AND kx_kq_storeinandout.platstatus = 1 ORDER BY kx_kq_storeinandout.signintime DESC LIMIT 1) AS visitingstatus, to_char(store.open_date, 'yyyy-MM-dd') AS open_date, to_char(store.close_date, 'yyyy-MM-dd') AS close_date, store.areascore, store.salescore, store.importancescore, store.totalscore, store.mdep_storelevel  ";

pageQuerySql += " FROM kx_kq_store AS store JOIN (select customerid,brandhead from kx_store_brandsell_info AS kx_store_brandsell_info WHERE kx_store_brandsell_info.platstatus = 1 group by customerid,brandhead union select dsr.store_id as customerid,dsr.dsr_id as brandhead from kx_dsr_store_info dsr where dsr.platstatus = 1 and dsr.tn_auditstatus = 1 ) info ON info.customerid = store.id JOIN pl_orgstruct AS member ON member.orgstructid = info.brandhead AND member.status = 1 AND member.userinfoid IS NOT NULL AND member.platstatus = 1 LEFT JOIN pl_userinfo AS userinfo ON userinfo.userinfoid = member.userinfoid AND userinfo.platstatus = 1 LEFT JOIN pl_orgstruct AS superior ON superior.orgstructid = member.parentmemberid AND superior.platstatus = 1 LEFT JOIN pl_userinfo AS su ON su.userinfoid = superior.userinfoid AND su.platstatus = 1 LEFT JOIN pl_dictionary AS dictionary ON dictionary.dictionaryid = userinfo.channeltype AND dictionary.platstatus = 1 LEFT JOIN pl_orgstruct AS pos ON pos.orgstructid = member.parentorgstructid AND pos.status = 1 AND pos.platstatus = 1 LEFT JOIN pl_orgstruct AS org ON org.orgstructid = pos.parentorgstructid AND org.status = 1 AND org.platstatus = 1 LEFT JOIN pl_org AS po ON po.orgid = org.orgid AND po.platstatus = 1 LEFT JOIN pl_dictionary AS usertype ON usertype.dickey = userinfo.usertype AND usertype.platstatus = 1 LEFT JOIN pl_dictionary AS ks ON ks.dictionaryid = store.storetype AND ks.platstatus = 1 LEFT JOIN pl_dictionary AS channelnature ON channelnature.dickey = store.channelnature AND channelnature.platstatus = 1 LEFT JOIN pl_dictionary AS salechannel ON salechannel.dickey = store.salechannle AND salechannel.platstatus = 1 LEFT JOIN pl_region AS pr ON pr.regionid = store.regionid AND pr.platstatus = 1 LEFT JOIN kx_kq_ka AS ka ON ka.id = store.kaid AND ka.platstatus = 1 LEFT JOIN pl_dictionary AS storelevel ON storelevel.dickey = store.storelevel AND storelevel.platstatus = 1 LEFT JOIN pl_dictionary AS customerlevel ON customerlevel.dickey = userinfo.customerlevel AND customerlevel.platstatus = 1  left join brandheadtable on brandheadtable.customerid = store.id ";
pageQuerySql += rule_res.join_sql;
pageQuerySql += " where 1=1 and store.status = 1 and store.platstatus = 1 ";

if (rule_res.where_sql != null && rule_res.where_sql != '') {
    if (rule_res.where_sql.indexOf(':ruleparam_codepath_600000000000000000_0') >= 0) {
        pageQuerySql += " AND  ((((area.codepath LIKE '" + SESSION.codepath + "%'))))"
    }

    if (rule_res.where_sql.indexOf(':ruleparam_mbcode_1315835724649598976_0') >= 0) {
        pageQuerySql += "AND ((exists (select 1 from kx_store_brandsell_info _bi left join pl_orgstruct po on po.orgstructid = _bi.brandhead left join pl_userinfo pu on pu.userinfoid = po.userinfoid left join pl_orgstruct po2 on po2.orgstructid = po.parentmemberid left join pl_userinfo pu2 on pu2.userinfoid = po2.userinfoid where _bi.customerid = store.id and (_bi.brandhead = '" + SESSION.mbcode + "' or po.parentmemberid = '" + SESSION.mbcode + "' or po2.parentmemberid = '" + SESSION.mbcode + "'))))"
    }
}

pageQuerySql += " and org.codepath like '" + SESSION.codepath + "%' ";

//售达方名称
if (IN.obj.channelname != '' && IN.obj.channelname != null) {
    pageQuerySql += " and exists(select 1 from ka_kq_channelcustomers AS uchannel where uchannel.id = userinfo.channel AND uchannel.platstatus = 1 and uchannel.channelname like '%" + IN.obj.channelname + "%' limit 1) ";
}
//售达方编码
if (IN.obj.channelcode != '' && IN.obj.channelcode != null) {
    pageQuerySql += "  and exists(select 1 from ka_kq_channelcustomers AS uchannel where uchannel.id = userinfo.channel AND uchannel.platstatus = 1 and uchannel.channelcode like '%" + IN.obj.channelcode + "%' limit 1) ";
}

//营销组织
if (saleareaids.length > 0) {
    pageQuerySql += "  and org.orgstructid in (" + saleareaids + ") ";
}
if (IN.obj.orgcode != '' && IN.obj.orgcode != null) {
    pageQuerySql += " and po.orgaccountcode like '%" + IN.obj.orgcode + "%' ";
}

//门店编码
if (IN.obj.storecode != '' && IN.obj.storecode != null) {
    pageQuerySql += " and store.storecode like '%" + +IN.obj.storecode + "%' ";
}

//门店名称
if (IN.obj.storename != '' && IN.obj.storename != null) {
    pageQuerySql += " and store.storename like '%" + IN.obj.storename + "%' ";
}

//人员编码
if (IN.obj.jobnumber != '' && IN.obj.jobnumber != null) {
    pageQuerySql += " and userinfo.jobnumber like  '%" + IN.obj.jobnumber + "%' ";
}

//人员名称
if (IN.obj.userinfoname != '' && IN.obj.userinfoname != null) {
    pageQuerySql += " and userinfo.userinfoname like '%" + IN.obj.userinfoname + "%' ";
}

//角色 
if (IN.obj.position != '' && IN.obj.position != null) {
    pageQuerySql += " and pos.orgname like '%" + IN.obj.position + "%' ";
}

//人员类型
if (IN.obj.usertype_keypath != '' && IN.obj.usertype_keypath != null && usertypelist.length > 0) {
    pageQuerySql += " and usertype.dickey in  (" + usertypelist + ") ";
}

//开店时间
if (IN.obj.openstarttime != '' && IN.obj.openstarttime != null && IN.obj.openendtime != '' && IN.obj.openendtime != null) {
    pageQuerySql += " and store.open_date >= '" + IN.obj.openstarttime + "'::timestamp and store.open_date <= '" + IN.obj.openendtime + "'::timestamp ";
}

//关店时间
if (IN.obj.closestarttime != '' && IN.obj.closestarttime != null && IN.obj.closeendtime != '' && IN.obj.closeendtime != null) {
    pageQuerySql += " and store.close_date >= '" + IN.obj.closestarttime + "'::timestamp and store.close_date <= '" + IN.obj.closeendtime + "'::timestamp ";
}

var final_Sql = pageQuerySql;

var createsql = "create table public." + tableName + "(";
createsql += " id int8 PRIMARY KEY,qudao VARCHAR,ziqudao VARCHAR,orgaccountcode VARCHAR,orgaccountname VARCHAR,storecode VARCHAR,storename VARCHAR,address VARCHAR,storeplate VARCHAR,referenceobj VARCHAR,ka VARCHAR,salechannle VARCHAR,channelnature VARCHAR,province VARCHAR,city VARCHAR,county VARCHAR,citylevel VARCHAR,jobcity VARCHAR,jobcitylevel VARCHAR,area VARCHAR,brand VARCHAR,storetype VARCHAR,storelevel VARCHAR,usertype VARCHAR,usercode VARCHAR,orgname VARCHAR,role VARCHAR,customerlevel VARCHAR,shiptopartycode VARCHAR,shiptopartyname VARCHAR,soldtopartycode VARCHAR,soldtopartyname VARCHAR,presentativecode VARCHAR,presentativename VARCHAR,superiorpresentativecode VARCHAR,superiorpresentativename VARCHAR,islocated VARCHAR,longitude VARCHAR,latitude VARCHAR,visitbias VARCHAR,visitingstatus VARCHAR,open_date VARCHAR,close_date VARCHAR,areascore VARCHAR,salescore VARCHAR,importancescore VARCHAR,totalscore VARCHAR,mdep_storelevel VARCHAR)";

var insertsql = "insert into "+ tableName + "(id,qudao,ziqudao,orgaccountcode,orgaccountname,storecode,storename,address,storeplate,referenceobj,ka,salechannle,channelnature,province,city,county,citylevel,jobcity,jobcitylevel,area,brand,storetype,storelevel,usertype,usercode,orgname,role,customerlevel,shiptopartycode,shiptopartyname,soldtopartycode,soldtopartyname,presentativecode,presentativename,superiorpresentativecode,superiorpresentativename,islocated,longitude,latitude,visitbias,visitingstatus,open_date,close_date,areascore,salescore,importancescore,totalscore,mdep_storelevel)";

//创建物理临时表
var execute_Sql = "select export_objs_funct(:selectsql,:createsql,:insertsql)";
try{
    SQL.query(execute_Sql,{"selectsql" : final_Sql,"createsql" : createsql,"insertsql" : insertsql});
}catch(e){
    throw new ERROR("导出超时,请联系管理员!")
}

//查询参数，可能需要根据入参参数，再进行二次处理
var queryParam = {};

//设置导出计算数量的语句
EXCELEXP.setQueryCountSql(countSql);

//针对物理表做分页导出
countSql = "select count(*) from " + tableName;
//数据查询SQL
pageQuerySql = "select * from " + tableName;
pageQuerySql = pageQuerySql + " limit :limit offset :offset ";

//设置导出计算数量的语句
EXCELEXP.setQueryCountSql(countSql);
//设置导出的查询语句
EXCELEXP.setPageQuerySql(pageQuerySql);

var dataAdjustHandle = function (data) {
    try {
        var jsonObj = JSON.parse(data.address);
        data.address = jsonObj.address;
    } catch (e) {
        data.address = "";
    }
    return data;
}

//设置调整数据方法
EXCELEXP.setDataAdjustHandle(dataAdjustHandle);
//执行导出
EXCELEXP.execute();

var drop_Sql = "drop table " + tableName ;
SQL.query(drop_Sql,{})