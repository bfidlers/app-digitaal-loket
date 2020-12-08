(define-resource application-form ()
  :class (s-prefix "lblodSubsidie:ApplicationForm")
  :properties `((:aanvraagdatum :datetime ,(s-prefix "subsidie:aanvraagdatum"))
                (:created :datetime ,(s-prefix "dct:created"))
                (:modified :datetime ,(s-prefix "dct:modified"))
                (:used-form-file :url ,(s-prefix "lblodSubsidie:usedFormFile")))
  :has-one `((bestuurseenheid :via ,(s-prefix "pav:createdBy")
                              :as "organization")
             (contact-punt :via ,(s-prefix "schema:contactPoint")
                            :as "contactinfo")
             (bank-account :via ,(s-prefix "schema:bankAccount")
                           :as "bank-account")
             (time-block :via ,(s-prefix "lblodSubsidie:timeBlock")
                         :as "time-block")
             (subsidy-measure :via ,(s-prefix "lblodSubsidie:subsidyMeasure")
                              :as "subsidy-measure")
             (application-form-table :via ,(s-prefix "lblodSubsidie:applicationFormTable")
                                     :as "application-form-table")
             (gebruiker :via ,(s-prefix "ext:lastModifiedBy")
                        :as "last-modifier")
             (gebruiker :via ,(s-prefix "dct:creator")
                        :as "creator")
             (submission-document-status :via ,(s-prefix "adms:status")
                                         :as "status"))
  :resource-base (s-url "http://data.lblod.info/application-forms/")
  :features '(include-uri)
  :on-path "application-forms")

(define-resource bank-account ()
  :class (s-prefix "schema:BankAccount")
  :properties `((:bank-account-number :string ,(s-prefix "schema:identifier")))
  :has-one `((file :via ,(s-prefix "dct:hasPart")
                    :as "confirmationLetter"))
  :resource-base (s-url "http://data.lblod.info/bank-accounts/")
  :features '(include-uri)
  :on-path "bank-accounts")

(define-resource time-block () ;; subclass of skos:Concept
  :class (s-prefix "gleif:Period")
  :properties `((:label :string ,(s-prefix "skos:prefLabel"))
                (:start :date ,(s-prefix "gleif:hasStart"))
                (:end :date ,(s-prefix "gleif:hasEnd")))
  :has-one `((time-block :via ,(s-prefix "ext:submissionPeriod")
                              :as "submission-period")
             (concept-scheme :via ,(s-prefix "skos:inScheme")
                              :as "concept-scheme"))
  :resource-base (s-url "http://lblod.data.gift/concepts/")
  :features '(include-uri)
  :on-path "time-blocks")

(define-resource subsidy-measure () ;; subclass of skos:Concept
  :class (s-prefix "lblodSubsidie:SubsidyMeasure")
  :properties `((:label :string ,(s-prefix "skos:prefLabel")))
  :has-one `((concept-scheme :via ,(s-prefix "skos:inScheme")
                              :as "concept-scheme"))
  :resource-base (s-url "http://lblod.data.gift/concepts/")
  :features '(include-uri)
  :on-path "subsidy-measures")

(define-resource application-form-table ()
  :class (s-prefix "lblodSubsidie:ApplicationFormTable")
  :has-many `((application-form-entry :via ,(s-prefix "ext:applicationFormEntry")
                                      :as "application-form-entries"))
  :resource-base (s-url "http://data.lblod.info/application-form-tables/")
  :features '(include-uri)
  :on-path "application-form-tables")

(define-resource application-form-entry ()
  :class (s-prefix "ext:ApplicationFormEntry")
  :properties `((:actorName :string ,(s-prefix "ext:actorName"))
                (:numberChildrenForFullDay :date ,(s-prefix "ext:numberChildrenForFullDay"))
                (:numberChildrenForHalfDay :date ,(s-prefix "ext:numberChildrenForHalfDay"))
                (:numberChildrenPerInfrastructure :date ,(s-prefix "ext:numberChildrenPerInfrastructure"))
                (:totalAmount :date ,(s-prefix "ext:totalAmount")))
  :resource-base (s-url "http://data.lblod.info/application-form-entries/")
  :features '(include-uri)
  :on-path "application-form-entries")
