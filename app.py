# This Python file uses the following encoding: utf-8

from flask import Flask, render_template, jsonify
from psycopg2 import connect

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
                    row_to_json((name, operator, st_length(ST_Collect(way)))) AS properties \
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