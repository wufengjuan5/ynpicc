var EARTH_R = 6378137.0;
function outOfChina( lat,  lng) {
    if (lng < 72.004 || lng > 137.8347) {
        return 1;
    }
    if (lat < 0.8293 || lat > 55.8271) {
        return 1;
    }
    return 0;
}
function fabs( x){
    return x > 0.0 ? x : -x;
}
function transform( x,  y) {
    var xy = x * y;
    var absX = Math.sqrt(fabs(x));
    var xPi = x * Math.PI;
    var yPi = y * Math.PI;
    var d = 20.0*Math.sin(6.0*xPi) + 20.0*Math.sin(2.0*xPi);
    var point = {};
    point.latitude = d;
    point.longitude = d;

    point.latitude += 20.0*Math.sin(yPi) + 40.0*Math.sin(yPi/3.0);
    point.longitude += 20.0*Math.sin(xPi) + 40.0*Math.sin(xPi/3.0);

    point.latitude += 160.0*Math.sin(yPi/12.0) + 320*Math.sin(yPi/30.0);
    point.longitude += 150.0*Math.sin(xPi/12.0) + 300.0*Math.sin(xPi/30.0);

    point.latitude *= 2.0 / 3.0;
    point.longitude *= 2.0 / 3.0;

    point.latitude += -100.0 + 2.0*x + 3.0*y + 0.2*y*y + 0.1*xy + 0.2*absX;
    point.longitude += 300.0 + x + 2.0*y + 0.1*x*x + 0.1*xy + 0.1*absX;
    return point;
}

function delta( lat,  lng) {
    var ee = 0.00669342162296594323;
    var trans = transform(lng - 105.0, lat - 35.0);
    var radLat = lat / 180.0 * Math.PI;
    var magic = Math.sin(radLat);
    magic = 1 - ee*magic*magic;
    var sqrtMagic = Math.sqrt(magic);
    trans.latitude = (trans.latitude * 180.0) / ((EARTH_R * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
    trans.longitude = (trans.longitude * 180.0) / (EARTH_R / sqrtMagic * Math.cos(radLat) * Math.PI);
    return trans;
}

function wgs2gcj( wgsLat,  wgsLng) {
    if (outOfChina(wgsLat, wgsLng) == 1) {
        return {latitude:wgsLat,longitude:wgsLng};
    }

    var deltaPoint = delta(wgsLat, wgsLng);
    var point = {};
    point.latitude = (wgsLat + deltaPoint.latitude);
    point.longitude = (wgsLng + deltaPoint.longitude);
    return point;
}

function gcj2wgs( gcjLat,  gcjLng) {
    if (outOfChina(gcjLat, gcjLng)== 1) {
        return {latitude:gcjLat,longitude:gcjLng};
    }
    var delta = delta(gcjLat, gcjLng);
    delta.latitude = gcjLat - delta.latitude;
    delta.longitude = gcjLng - delta.longitude;
    return delta;
}



function distance( latA,  lngA,  latB,  lngB) {
    var arcLatA = latA * Math.PI/180;
    var arcLatB = latB * Math.PI/180;
    var x = Math.cos(arcLatA) * Math.cos(arcLatB) * Math.cos((lngA-lngB)*Math.PI/180);
    var y = Math.sin(arcLatA) * Math.sin(arcLatB);
    var s = x + y;
    if (s > 1) {
        s = 1;
    }
    if (s < -1) {
        s = -1;
    }
    var alpha = Math.acos(s);
    return alpha * EARTH_R;
}