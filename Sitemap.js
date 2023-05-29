SalesforceInteractions.init({    // Initializes the Interaction Studio Web SDK
    cookieDomain: "perficient.com"    // Optional tracking cookie domain configuration (overrides default)
}).then(() => {

    const sitemapConfig = {    // Sitemap configuration object
        global: {},
        pageTypeDefault: {
            name: "default",
            interaction:{
                name:"Default"
            }
        }, 
        pageTypes: [
            {
                name: "home",
                //isMatch: () =>  /^\/$/.test(window.location.pathname),
                isMatch: () =>  SalesforceInteractions.cashDom("meta[property='og:url']").first().attr("content")=="https://www.perficient.com/",  
                interaction: {
                    name: "Homepage",
                },    
                contentZones: [
                    { name: "home_hero", selector: "div.component-wrapper" },
                    { name: "home_contact_cta", selector: "div.waveform" },
                    { name: "home_imagine_banner", selector: "div.background background--is-dark"}
                ]
            },
            {
                name: "contact",
                isMatch: () => /^\/contact\/?$/.test(window.location.pathname),
                interaction: {
                    name: "Contact",
                },
                contentZones: [
                    { name: "contact_banner", selector: "div.component-header.main-padding-large" },
                ],
                listeners: [
                    SalesforceInteractions.listener("submit", ".contact-form", (e) => {
                            console.log("entramos al listener");
                            console.log("Entro al form");
                            SalesforceInteractions.sendEvent({
                                interaction: {
                                    name: 'Email Capture'
                                },
                                user: {
                                    identities: { 
                                        emailAddress: document.getElementById("fxb_707ece81-9a56-434c-9b8a-cfd406a472f7_Fields_fcc3ab01-3032-42a6-b747-9b73b735090d__Value").value,
                                        firstName: document.getElementById("fxb_707ece81-9a56-434c-9b8a-cfd406a472f7_Fields_3992d3d8-6182-4b16-8be5-a9a7561ccdbe__Value").value,
                                        lastName: document.getElementById("fxb_707ece81-9a56-434c-9b8a-cfd406a472f7_Fields_06c6dc06-f150-409a-bc0f-94240b2e7368__Value").value,
                                        companyName: document.getElementById("fxb_707ece81-9a56-434c-9b8a-cfd406a472f7_Fields_7ef78c1c-bb93-440a-8471-018f8eaa78b7__Value").value,
                                        jobTitle: document.getElementById("fxb_707ece81-9a56-434c-9b8a-cfd406a472f7_Fields_5daf3bdc-fb0a-4094-8e51-74813118b3c5__Value").value,
                                        phoneNumber: document.getElementById("fxb_707ece81-9a56-434c-9b8a-cfd406a472f7_Fields_56fcbbc7-a2a3-48d4-82bd-799902a5c451__Value").value
                                    }
                                }
                            });
                    })
                ],
            },
            {
                name: "blog_detail",
                isMatch: () => {
                    return SalesforceInteractions.cashDom("meta[property='og:site_name']").first().attr("content")=="Perficient Blogs" && SalesforceInteractions.cashDom("meta[property='og:type']").first().attr("content")=="article";
                },
                interaction: {
                    name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
                    catalogObject: {
                        type: "Blog",
                        id:  window.location.pathname.split('/')[4],
                        attributes: {
                            url: SalesforceInteractions.resolvers.fromCanonical(),
                            name: SalesforceInteractions.resolvers.fromMeta("og:title"),
                            imageUrl: SalesforceInteractions.resolvers.fromMeta("og:image")
                        }
                    }
                },
                contentZones: [
                    { 
                        name: "blog_content", 
                        selector: ".entry" 
                    }
                ]
            },
            {
                name: "industries",
                isMatch : () => {
                    return SalesforceInteractions.cashDom("meta[property='og:url']").first().attr("content").split('/')[3] == "industries"
                },
                interaction:{
                    name: "Industry visit"
                },
                interaction:{
                    name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
                    catalogObject:{
                        type: "Industry",
                        id: window.location.pathname.split('/')[2],
                        attributes: {
                            name: SalesforceInteractions.resolvers.fromMeta("og:title"),
                            url: SalesforceInteractions.resolvers.fromCanonical(),
                            imageUrl: SalesforceInteractions.resolvers.fromMeta("og:image")

                        }
                    }
                }
            }         
        ]          // Array used to contain the page type object configurations
    }

    SalesforceInteractions.initSitemap(sitemapConfig);    // Initializes the Sitemap
});