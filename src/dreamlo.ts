/// <reference path="score.ts" />
/// <reference path="scoreFormat.ts" />
/// <reference path="sortOrder.ts" />
namespace dreamLo {
    let _baseUrl = "http://dreamlo.com/lb/";
    let _publicKey = "";
    let _privateKey = "";
    export function initialize(publicKey: string, privateKey: string, useHttps = false): void {
        if (useHttps) {
            _baseUrl = _baseUrl.replace("http://", "https://");
        }
        _publicKey = publicKey;
        _privateKey = privateKey;
    }
    export async function getScores(format: ScoreFormat = ScoreFormat.Json, sortOrder: SortOrder = SortOrder.PointsDescending, skip: number = 0, take?: number): Promise<string> {
        if (!_publicKey) {
            throw new Error("DreamLo public key not set. Call DreamLo.initialize() first.");
        }

        let url = _baseUrl + _publicKey + "/" + format + sortOrder + "/" + skip;
        if (take) {
            url += "/" + take;
        }

        return await _get(url);
    }
    export async function getScore(name: string, format: ScoreFormat = ScoreFormat.Json): Promise<string> {
        if (!_publicKey) {
            throw new Error("DreamLo public key not set. Call DreamLo.initialize() first.");
        }
        if (!name) {
            throw new Error("DreamLo getScore name parameter is required.");
        }

        let url = _baseUrl + _publicKey + "/" + format + "-get/" + name;

        return await _get(url);
    }
    export async function addScore(score: Score, format: ScoreFormat = ScoreFormat.Json, sortOrder: SortOrder = SortOrder.PointsDescending): Promise<string> {
        if (!_privateKey) {
            throw new Error("DreamLo private key not set. Call DreamLo.initialize() first.");
        }
        if (!score.name) {
            throw new Error("DreamLo addScore score.name property is required.");
        }
        if (!score.points) {
            throw new Error("DreamLo addScore score.points property is required.");
        }

        let url = _baseUrl + _privateKey + "/add-" + format + sortOrder + "/" + score.name + "/" + score.points + "/" + score.seconds ?? "";
        if (score.text) {
            url += "/" + score.text;
        }

        return await _get(url);
    }
    export async function deleteScores(): Promise<void> {
        if (!_privateKey) {
            throw new Error("DreamLo private key not set. Call DreamLo.initialize() first.");
        }

        const url = _baseUrl + _privateKey + "/clear";
        await _get(url);
    }
    export async function deleteScore(name: string): Promise<void> {
        if (!_privateKey) {
            throw new Error("DreamLo private key not set. Call DreamLo.initialize() first.");
        }
        if (!name) {
            throw new Error("DreamLo deleteScore name parameter is required.");
        }

        const url = _baseUrl + _privateKey + "/delete/" + name;
        await _get(url);
    }
    async function _get(url: string): Promise<string> {
        let data = "";
        await fetch(url)
            .then((response) => response.text())
            .then((text) => {
                data = text;
            })
            .catch((error) => {
                throw new Error("DreamLo request returned: " + error);
            });

        return data;
    }
}
