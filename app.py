# This Python file uses the following encoding: utf-8

from flask import Flask, render_template, jsonify
from psycopg2 import connect, sql

app = Flask(__name__)


@app.route("/")
def main():
    return render_template('main.html')


@app.route("/api/get/hikes")
def api_get_hiking():
    conn = connect("dbname=gis user=postgres")
    cur = conn.cursor()

    cur.execute(
        "SELECT row_to_json(fc) \
        FROM ( \
            SELECT \
                'FeatureCollection' AS type, \
                array_to_json(array_agg(f)) AS features \
            FROM ( \
                SELECT \
                    'Feature' AS type, \
                    ST_AsGeoJSON(ST_Transform(ST_Collect(way), 4326))::json AS geometry, \
                    row_to_json(( \
                        name, \
                        operator, \
                        round((st_length(ST_Collect(way))::numeric/1000), 2), \
                        ST_AsText(ST_Centroid(ST_Transform(ST_Collect(way), 4326))) \
                    )) AS properties \
                FROM planet_osm_line  \
                WHERE route = 'hiking' \
                    and name is not null \
                GROUP by name, operator \
            ) \
            AS f ) \
        AS fc;"
    )

    response = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(data=response)


@app.route("/api/get/amenities/<hike>")
def api_get_amenities(hike):
    conn = connect("dbname=gis user=postgres")
    cur = conn.cursor()

    cur.execute(
        sql.SQL(
            "with hike as( \
                SELECT ST_Collect(l.way) AS geometry, name \
                FROM planet_osm_line as l \
                WHERE \
                    l.route = 'hiking' \
                    and l.name = %s \
                GROUP by l.name, l.operator \
            ) \
            SELECT row_to_json(fc) \
            FROM ( \
                SELECT 'FeatureCollection' AS type, array_to_json(array_agg(f)) AS features \
                FROM ( \
                    SELECT 'Feature' AS type, ST_AsGeoJSON(ST_Transform(p.way, 4326))::json AS geometry,\
                    row_to_json((p.name, p.historic)) AS properties \
                    from hike as h \
                    cross join planet_osm_point as p \
                    where \
                        p.name is not null \
                        and p.historic is not null \
                        and ST_DWithin(h.geometry, p.way, 5000) \
                ) AS f \
            ) AS fc;"
        ),
        [hike]
    )

    response = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(data=response)