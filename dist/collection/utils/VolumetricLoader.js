import { VolumeFileType } from "../enums";
import { Utils } from "../utils";
export class VolumetricLoader {
    // tslint:disable-next-line: no-any
    load(src, container) {
        // tslint:disable-next-line: no-any
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const fileExtension = Utils.getFileExtension(src);
            const fileEnd = Utils.getFileEndCharacters(src, 3);
            if (Object.values(VolumeFileType).includes(fileExtension) ||
                Object.values(VolumeFileType).includes(fileEnd)) {
                let data = [src];
                this._loadVolume(data, resolve, reject, container);
            }
            else {
                xhr.open("GET", src, true);
                xhr.onload = () => {
                    let data = JSON.parse(xhr.responseText);
                    data = this._mapfiles(data.baseurl, data.series);
                    this._loadVolume(data, resolve, reject, container);
                };
                xhr.onerror = error => {
                    reject(error);
                };
                xhr.send();
            }
        });
    }
    _loadVolume(data, resolve, reject, container) {
        const loader = new AMI.VolumeLoader(container);
        loader
            .load(data)
            .then(() => {
            const sr = loader.data[0].mergeSeries(loader.data);
            const stack = sr[0].stack[0];
            loader.free();
            resolve(stack);
        })
            .catch(error => {
            // tslint:disable-next-line: no-console
            console.error("Volume load error");
            reject(error);
        });
    }
    _mapfiles(baseurl, files) {
        return files.map(filename => {
            if (!baseurl.endsWith("/")) {
                baseurl += "/";
            }
            return `${baseurl}${filename}`;
        });
    }
}
