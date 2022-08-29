

var isexist = checkExists(param,'1');
if(isexist != null && isexist.length > 0){
    if(IN.kx_shopgoods_std_info.putinscope == '1' || IN.kx_shopgoods_std_info.putinscope == '3'){
        var ids;
        if(IN.kx_shopgoods_std_info.putinscope == '1'){ ids = JSON.parse(IN.kx_shopgoods_std_info.saleareaids)}
        if(IN.kx_shopgoods_std_info.putinscope == '3'){ ids = JSON.parse(IN.kx_shopgoods_std_info.regionids)}
        if(ids != null && ids.length > 0){
            for(var m in isexist){
                for(var n in ids){
                    if(isexist[m].codepath.indexOf(ids[n]) >= 0){
                        throw new ERROR("已存在编号为"+isexist[m].code+"铺货标准");
                    }
                }
            }
        }
    }
}




var isexist = checkExists(param,'2');
if(isexist != null && isexist.length > 0){
    if(IN.kx_shopgoods_std_info.putinscope == '1' || IN.kx_shopgoods_std_info.putinscope == '3'){
        var ids;
        if(IN.kx_shopgoods_std_info.putinscope == '1'){ ids = JSON.parse(IN.kx_shopgoods_std_info.saleareaids)}
        if(IN.kx_shopgoods_std_info.putinscope == '3'){ ids = JSON.parse(IN.kx_shopgoods_std_info.regionids)}
        if(ids != null && ids.length > 0){
            for(var m in isexist){
                for(var n in ids){
                    if(isexist[m].codepath.indexOf(ids[n]) >= 0){
                        throw new ERROR("已存在编号为"+isexist[m].code+"铺货标准");
                    }
                }
            }
        }
    }
}


function checkExists(param){
    //此查询为查询出该类型的所有方案
    isnew = (param.id == '' || param.id == null) ? '1' : '2';
    var result = select
    {#if param.putinscope == '1'}
    b.codepath as codepath,
        {#endif}
    {#if param.putinscope == '3'}
    c.idpath as codepath,
        {#endif}
    a.*
    from kx_shopgoods_std_info a
    {#if param.putinscope == '1'}
    left join kx_shopgoods_putin_salearea area on area.stdid = a.id
    left join pl_orgstruct b on b.orgstructid = area.saleareaid
    {#endif}
    {#if param.putinscope == '3'}
    left join kx_shopgoods_putin_regions region on region.stdid = a.id
    left join pl_region c on c.regionid = region.regionid
    {#endif}
    where 1=1
    {#if isnew != '1'}
    and a.id != {param.id}
    {#endif}
    and not ( a.starttime > {param.endtime} or a.endtime < {param.starttime} )
    and a.channeltype = {param.channeltype}
    and a.targetobjid = {param.targetobjid}
    and a.status = {param.status}
    and a.putinscope = {param.putinscope}
    NORULE;
    return result;
}