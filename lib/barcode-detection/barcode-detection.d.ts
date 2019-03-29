/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
declare global {
    interface Window {
        idbKeyval: {
            set(name: string, value: any): Promise<void>;
            get(name: string): Promise<{}>;
        };
        PerceptionToolkit: {
            config: {
                root?: string;
                onboarding?: boolean;
                onboardingImages?: string[];
                button?: HTMLElement;
                buttonSelector?: string;
                buttonVisibilityClass?: string;
                cardContainer?: HTMLElement;
                hintTimeout?: number;
                detectionMode?: 'active' | 'passive';
                showLoaderDuringBoot?: boolean;
                sitemapUrl?: string;
            };
            loader: {
                hideLoader(): void;
                showLoader(): void;
            };
            main: {
                initialize(opts: {
                    detectionMode?: 'active' | 'passive';
                    sitemapUrl?: string;
                }): void;
            };
            onboarding: {
                startOnboardingProcess(images: string[]): Promise<void>;
            };
        };
    }
}
/**
 * Initialize the experience.
 */
export declare function initializeExperience(): Promise<void>;
