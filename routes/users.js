var express = require('express');
var router = express.Router();
let nem = require('nem-sdk').default;
let endpoint = nem.model.objects.create('endpoint')(
    nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort
);
let common = nem.model.objects.create("common")("", "75e38c8bdc8c9fb96d8b093162a07d70b76a63c5c02b6cf5185c5c00e70ee414");

/* GET users listing. */
router.get('/:wallet', function (req, res, next) {
    nem.com.requests.account.data(endpoint, req.param('wallet'))
        .then(function (nemRes) {
            res.send(nemRes);
        }, function (err) {
            res.send(err)
        })
});

router.post('/send_certificate', function (req, res, next) {
    let wallet = req.body.wallet;
    let namespaceId = 'tests';
    let mosaicName = 'certificate';

    let mosaicDefinitionMetaDataPair = nem.model.objects.get("mosaicDefinitionMetaDataPair");
    let transferTransaction = nem.model.objects.create("transferTransaction")(wallet, 1, "Now you have proof of your intelligence.");
    let mosaicAttachment = nem.model.objects.create("mosaicAttachment")(namespaceId, mosaicName, 1);
    transferTransaction.mosaics.push(mosaicAttachment);

    nem.com.requests.namespace.mosaicDefinitions(endpoint, namespaceId)
        .then(function (nemRes) {

            let neededDefinition = nem.utils.helpers.searchMosaicDefinitionArray(
                nemRes.data, [mosaicName]
            );
            let fullMosaicName = nem.utils.format.mosaicIdToName(mosaicAttachment.mosaicId);

            mosaicDefinitionMetaDataPair[fullMosaicName] = {};
            mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition = neededDefinition[fullMosaicName];

            return nem.model.transactions.prepare("mosaicTransferTransaction")(
                common,
                transferTransaction,
                mosaicDefinitionMetaDataPair,
                nem.model.network.data.testnet.id);
        })
        .then(function (transactionEntity) {
            return nem.model.transactions.send(common, transactionEntity, endpoint);
        })
        .then(function (sendResponse) {
            res.send(sendResponse);
        }, function (err) {
            res.send(err);
        })

});

module.exports = router;
