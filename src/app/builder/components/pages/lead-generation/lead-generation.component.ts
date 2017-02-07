import {Script} from "../../../services/script.service";
import {Page, SUBMIT_BUTTON, INPUT_NAME, INPUT_EMAIL, SUB_HEADING, MAIN_HEADING} from "../../../models/PageModel";
import {SavePage, sectionLeadGeneration} from "../../../services/savePage.service";
import {Component, OnInit} from "@angular/core";
declare var jQuery: any
declare var filepicker: any;

@Component({
    selector: 'lead-generation',
    templateUrl: './lead-generation.component.html',
    styleUrls: ['./assets/style.css']
})
export class LeadGenerationComponent implements OnInit {

    imgElement: Object;
    page: Page = new Page();
    filePickerKey: any = "A4VUUCqJTBKGi5JXFxPZ3z";

    constructor(script: Script, private savePageService: SavePage) {
        script.load('filepicker').then(data => {
            console.log('script loaded ', data);
        }).catch(error => console.log(error));
    }

    ngOnInit() {
        //check if local storage exists
        if (this.savePageService.getFromLocalStore()) {
            console.log('init second time');
            this.page = JSON.parse(this.savePageService.getFromLocalStore());
        } else {
            this.initializeViewContent();
            console.log('init first time');
        }

        this.savePageService.notifyPageChanges(this.page);
        this.savePageService.getPageChangeObservable().debounceTime(1000)
            .distinctUntilChanged((x: string, y: string) => (x == y),
                (x: Page) => (JSON.stringify(x.control))).subscribe(data => {
            this.savePageService.saveToLocalStore(JSON.stringify(data));
        });
    }

    private initializeViewContent() {
        this.page.pagetype = sectionLeadGeneration;
        this.page.control[MAIN_HEADING] = "Calculate the risk of you getting a heart disease.";
        this.page.control[SUB_HEADING] = "Heart problems are at an all time high. See if your lifestyle makes you susceptible.";
        this.page.control[INPUT_NAME] = "John Doe";
        this.page.control[INPUT_EMAIL] = "John@outgrow.co";
        this.page.control[SUBMIT_BUTTON] = "Estimate Costs";
    }

    setMainHeading(event) {
        this.page.control[MAIN_HEADING] = event.target.textContent;
        this.savePageService.notifyPageChanges(this.page);
    }

    setSubHeading(event) {
        this.page.control[SUB_HEADING] = event.target.textContent;
        this.savePageService.notifyPageChanges(this.page);
    }

    setInputEmail(event) {
        this.page.control[INPUT_EMAIL] = event.target.value;
        this.savePageService.notifyPageChanges(this.page);
    }

    setInputName(event) {
        this.page.control[INPUT_NAME] = event.target.value;
        this.savePageService.notifyPageChanges(this.page);
    }

    setSubmitButton(event) {
        this.page.control[SUBMIT_BUTTON] = event.target.textContent;
        this.savePageService.notifyPageChanges(this.page);
    }

    uploadImage(control: any) {
        filepicker.setKey(this.filePickerKey);
        filepicker.pick(
            {
                mimetypes: ['image/*'],
                imageQuality: 50
            },
            (InkBlob: any) => {
                control.src = InkBlob.url;
                jQuery('#filepicker_dialog_container').find('a').click();
            }, (FPError: any) => {
                console.log(FPError.toString());
            });
    }
}
