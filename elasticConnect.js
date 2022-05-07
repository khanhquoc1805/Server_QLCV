import { Client } from "@elastic/elasticsearch";
import FullText from "./model/FullText.js";
const client = new Client({
    node: "https://localhost:9200",
    auth: {
        username: "elastic",
        password: "6eKNq=2eMcLtlsk_XlCP",
    },
    tls: {
        ca: "59ef13b1c8a2f03e13cb9d70036591cbb66073e53a88f027aef26556070bbc27",
        rejectUnauthorized: false,
    },
});

export async function elasticConnect() {
    // Let's start by indexing some data
    // await client.index({
    //     index: "cvdi",
    //     document: {
    //         linhvuc: "Ned Stark",
    //         tenvbdi: "Winner is coming baby coming.",
    //         mavbdi: 1,
    //     },
    // });
    // await client.index({
    //     index: "cvdi",
    //     document: {
    //         linhvuc: "Daenerys Targaryen",
    //         tenvbdi: "I am of the dragon is red.",
    //         mavbdi: 2,
    //     },
    // });
    // await client.index({
    //     index: "cvdi",
    //     document: {
    //         linhvuc: "Tyrion Lannister",
    //         tenvbdi: "A mind needs books like a whetstone on story.",
    //         mavbdi: 3,
    //     },
    // });
    // await client.index({
    //     index: "cvdi",
    //     document: {
    //         linhvuc: "Daenerys Targaryen",
    //         tenvbdi: "I am the blood of dragon by train.",
    //         mavbdi: 4,
    //     },
    // });

    //  await client.index({
    //     index: "cvdi",
    //     document: {
    //         linhvuc: "Ned Stark",
    //         tenvbdi: "Winner is coming.",
    //         mavbdi: 5,
    //     },
    // });
    // await client.index({
    //     index: "cvdi",
    //     document: {
    //         linhvuc: "Daenerys Targaryen",
    //         tenvbdi: "I am of the dragon.",
    //         mavbdi: 6,
    //     },
    // });
    // await client.index({
    //     index: "cvdi",
    //     document: {
    //         linhvuc: "Tyrion Lannister",
    //         tenvbdi: "A mind needs books like a whetstone.",
    //         mavbdi: 7,
    //     },
    // });
    // await client.index({
    //     index: "cvdi",
    //     document: {
    //         linhvuc: "Daenerys Targaryen",
    //         tenvbdi: "I am the blood of dragon.",
    //         mavbdi: 8,
    //     },
    // });

    //await client.indices.delete({index: "cvdi"});
    // const data = await FullText.findAll({});
    // console.log(data.length);
    // let i = 0;
    // for (const record of data) {
    //     await client.index({
    //         index: "game-of-thrones",
    //         document: {
    //             text: record.getDataValue("text"),
    //         },
    //     });
    //     console.log(++i);
    // }
    // here we are forcing an index refresh, otherwise we will not
    // get any result in the consequent search
    // await client.indices.refresh({ index: "search" });
    // const result = await client.search({
    //     index: "search",
    //     search_type: "query_then_fetch",
    //     size: 9999,
    //     body: {
    //         query: {
    //             match: {
    //                 text: "Mental Center",
    //             },
    //         },
    //     },
    //     // query: {
    //     //     multi_match: {
    //     //         query: "Hospital",
    //     //         fields: ["text"],
    //     //     },
    //     // },
    // });
    // await client.indices.delete({ index: "cvdi" });

    // for(let i= 0; i < 4; i++) {

    // }
    // const result = await client.search({
    //     index: "cvdi",
    //     //search_type: "query_then_fetch",
    //     from : 7,
    //     size: 2,
    //     // body: {
    //     //     query: {
    //     //         match: {
    //     //             tenvbdi: "of",
    //     //         },
    //     //     },
    //     // },
    //     // query: {
    //     //     multi_match: {
    //     //         query: "Hospital",
    //     //         fields: ["text"],
    //     //     },
    //     // },
    // });
    // console.log(result.hits.hits);
    // console.log(result.hits.hits.length);

    // var createIndexResponse = await client.indices.CreateAsync(
    //     "cvdi",
    //     (c) =>
    //         c.Settings((s) =>
    //             s.Setting(UpdatableIndexSettings.MaxResultWindow, 50000)
    //         )
    // );
    // await client.indices.UpdateSettingsAsync("cvdi", (s) =>
    //     s.IndexSettings((i) =>
    //         i.Setting(UpdatableIndexSettings.MaxResultWindow, 50000)
    //     )
    // );
    await client.indices.putSettings(
        { index: "cvdi" },
        { body: [{ index: { max_result_window: 40000 } }] }
    );
}
