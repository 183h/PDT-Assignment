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
            SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features \
            FROM ( \
                SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(way, 4326))::json As geometry, row_to_json((name, operator)) As properties \
                FROM planet_osm_line where route = 'hiking' and name is not null) \
            As f ) \
        As fc;"
    )

    response = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(data=response)