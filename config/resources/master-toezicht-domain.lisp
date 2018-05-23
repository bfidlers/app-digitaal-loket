(define-resource inzending-voor-toezicht ()
  :class (s-prefix "toezicht:InzendingVoorToezicht") ;; subclass of nie:InformationElement > nfo:DataContainer
  :properties `((:created :datetime ,(s-prefix "dct:created"))
                (:modified :datetime ,(s-prefix "dct:modified"))
                (:sent-date :datetime ,(s-prefix "nmo:sentDate"))
                (:description :string ,(s-prefix "dct:description"))
                (:remark :string ,(s-prefix "ext:remark"))
                (:temporal-coverage :string ,(s-prefix "toezicht:temporalCoverage"))
                (:business-identifier :string ,(s-prefix "toezicht:businessIdentifier"))
                (:business-name :string ,(s-prefix "toezicht:businessName"))
                (:nomenclature :string ,(s-prefix "toezicht:nomenclature"))
                (:date-of-entry-into-force :date ,(s-prefix "toezicht:dateOfEntryIntoForce"))
                (:end-date :date ,(s-prefix "toezicht:endDate"))
                (:is-modification :boolean ,(s-prefix "toezicht:isModification"))
                (:has-extra-tax-rates :boolean ,(s-prefix "toezicht:hasExtraTaxRates"))
                (:agenda-item-count :integer ,(s-prefix "toezicht:agendaItemCount"))
                (:session-date :datetime ,(s-prefix "toezicht:sessionDate"))
                (:title :string ,(s-prefix "dct:string"))
                )
  :has-one `((document-status :via ,(s-prefix "adms:status")
                              :as "status")
             (gebruiker :via ,(s-prefix "ext:lastModifiedBy")
                        :as "last-modifier")
             (bestuurseenheid :via ,(s-prefix "dct:subject")
                              :as "bestuurseenheid")
             (form-solution :via ,(s-prefix "ext:hasInzendingVoorToezicht")
                            :inverse t
                            :as "form-solution")
             (toezicht-inzending-type :via ,(s-prefix "dct:type")
                                     :as "inzending-type")
             (besluit-type :via ,(s-prefix "toezicht:decisionType")
                           :as "besluit-type")
             (bestuursorgaan :via ,(s-prefix "toezicht:decidedBy")
                             :as "bestuursorgaan")
             )
  :has-many `((file :via ,(s-prefix "nie:hasPart")
                    :as "files")
              (tax-rate :via ,(s-prefix "toezicht:taxRate")
                        :as "tax-rates")
              )
  :resource-base (s-url "http://data.lblod.info/inzendingen-voor-toezicht/")
  :features `(no-pagination-defaults include-uri)
  :on-path "inzendingen-voor-toezicht"
  )

(define-resource toezicht-inzending-type ()
  :class (s-prefix "toezicht:InzendingType")
  :properties `((:label :string ,(s-prefix "skos:prefLabel")))
  :resource-base (s-url "http://data.lblod.info/toezicht-inzending-types")
  :features `(inclure-uri)
  :on-path "toezicht-inzending-types"
  )
(define-resource besluit-type ()
  :class (s-prefix "toezicht:decisionType")
  :properties `((:label :string ,(s-prefix "skos:prefLabel")))
  :resource-base (s-url "http://data.lblod.info/besluit-types")
  :features `(include-uri)
  :on-path "besluit-types"
  )


(define-resource tax-rate ()
  :class (s-prefix "toezicht:TaxRate")
  :properties `((:amount :float ,(s-prefix "toezicht:amoount"))
                (:unit :string ,(s-prefix "toezicht:unit"))
                (:base :string ,(s-prefix "toezicht:base"))
                (:remark :string ,(s-prefix "ext:remark")))
  :resource-base (s-url "http://data.lblod.info/tax-rates")
  :features `(include-uri)
  :on-path "tax-rates")

(define-resource form-solution ()
  :class (s-prefix "ext:FormSolution")
  :properties `((:has-owner :string ,(s-prefix "ext:hasOwnerAsString")))
  :has-one `((form-node :via ,(s-prefix "ext:hasForm")
                        :as "form-node")
             (inzending-voor-toezicht :via ,(s-prefix "ext:hasInzendingVoorToezicht")
                                      :as "inzending-voor-toezicht"))
  :resource-base (s-url "http://data.lblod.info/form-solutions/")
  :on-path "form-solutions")

