export async function getLengthData(params, client) {

    let allRecords = [];

    // first we do a search, and specify a scroll timeout
    var { _scroll_id, hits } = await client.search(params);

    while (hits && hits.hits.length) {
        // Append all new hits
        allRecords.push(...hits.hits);

        var { _scroll_id, hits } = await client.scroll({
            scroll_id: _scroll_id,
            scroll: params.scroll,
        });
    }
    return allRecords.length;
}
