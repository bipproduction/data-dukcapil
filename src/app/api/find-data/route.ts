import { NextRequest, NextResponse } from "next/server";
const { tsv2json, json2tsv } = require('tsv-json');
import _ from 'lodash'



export async function GET(req: NextRequest) {
    const from = +(new URL(req.url).searchParams.get("from") ?? 0)
    const data = await fetch(`https://gis.dukcapil.kemendagri.go.id/arcgis/rest/services/Data_baru_18072017/MapServer/3/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=giskemendagri.gisadmin.Desa_Spasial_07072017.objectid_1%20ASC&resultOffset=${from}&resultRecordCount=100`).then(v => v.json()).then(v => v)
    const hasil = (data.features as []).map((v: any) => v.attributes)

    const body = hasil.map(v => [..._.values(v).map(v => "" + v)])
    const header = [_.keys(hasil[0]).map(v => v.replace("giskemendagri.gisadmin.", ''))]

    const result = json2tsv([...header, ...body])
    return new NextResponse(result)
}