#!/usr/bin/env bash
set -euo pipefail

USERNAME=$1
PASSWORD=$2
BACKTRACK_IN_DAYS=${3:--1}

log()
{
    echo "$@" >&2
}

request()
{
    curl \
        --digest -u "${USERNAME}:${PASSWORD}" \
        -H 'accept: application/json' \
        --silent \
        --compressed \
        "$@"
}

detect_baseurl()
{
    local asn
    asn=$(request -D - 'https://director.myenergi.net' \
        | grep x_myenergi-asn \
        | grep -v undefined \
        | cut -d: -f2 \
        | cut -c2- \
        | tr -d '\r')
    echo "https://${asn}"
}

detect_zappi_sno()
{
    request "${BASEURL}/cgi-jstatus-Z" \
        | jq '.zappi[0].sno'
}

get_storage_file()
{
    local backtrack_in_days=$1

    local datestr
    datestr=$(date -d "today ${backtrack_in_days} day" "+%Y/%m/%d")

    local path
    path="./data/${datestr}.json"

	mkdir -p "$(dirname "${path}")"
    echo "${path}"
}

get_zappi_data()
{
    local zappi_sno=$1
    local backtrack_in_days=$2

    local datestr
    datestr=$(date -d "today ${backtrack_in_days} day" "+%Y-%m-%d")

    log "Fetching Zappi data for ${datestr}"

	request "${BASEURL}/cgi-jday-Z${zappi_sno}-${datestr}" \
		| jq --sort-keys ".U${zappi_sno}"
}

BASEURL="$(detect_baseurl)"
log "Constructed baseurl: ${BASEURL}"

ZAPPIE_SNO="$(detect_zappi_sno)"
log "Found Zappi SNO: ${ZAPPIE_SNO}"

while [ "${BACKTRACK_IN_DAYS}" -le -1 ]; do
    OUTFILE="$(get_storage_file "${BACKTRACK_IN_DAYS}")"
    get_zappi_data "${ZAPPIE_SNO}" "${BACKTRACK_IN_DAYS}" > "${OUTFILE}"

	BACKTRACK_IN_DAYS=$(( BACKTRACK_IN_DAYS + 1 ))
done
