(define-resource inzending-voor-toezicht ()
  :class (s-prefix "toezicht:InzendingVoorToezicht") ;; subclass of nie:InformationElement > nfo:DataContainer
  :properties `((:created :datetime ,(s-prefix "dct:created"))
                (:modified :datetime ,(s-prefix "dct:modified"))
                (:description :string ,(s-prefix "dct:description"))
                (:remark :string ,(s-prefix "ext:remark"))
                (:temporalCoverage :string ,(s-prefix "toezicht:temporalCoverage"))
                (:businessIdentifier :string ,(s-prefix "toezicht:businessIdentifier"))
                (:businessName :string ,(s-prefix "toezicht:businessName"))
                (:nomenclature :string ,(s-prefix "toezicht:nomenclature"))
                (:dateOfEntryIntoForce :date ,(s-prefix "toezicht:dateOfEntryIntoForce"))
                (:endDate :date ,(s-prefix "toezicht:endDate"))
                (:isModification :boolean ,(s-prefix "toezicht:isModification"))
                (:hasExtraTaxRates :boolean ,(s-prefix "toezicht:hasExtraTaxRates"))
                (:agendaItemCount :boolean ,(s-prefix "toezicht:agendaItemCount"))
                )
  :has-one `((document-status :via ,(s-prefix "adms:status")
                              :as "status")
             (gebruiker :via ,(s-prefix "ext:lastModifiedBy")
                        :as "last-modifier")
             (bestuurseenheid :via ,(s-prefix "dct:subject")
                              :as "bestuurseenheid"))
  :has-many `((file :via ,(s-prefix "nie:hasPart")
                    :as "files")
              (tax-rate :via ,(s-prefix "toezicht:taxRate")
                        :as "tax-rates")
              )

  :resource-base (s-url "http://data.lblod.info/inzendingen-voor-toezicht/")
  :features `(no-pagination-defaults include-uri)
  :on-path "inzendingen-voor-toezicht"
  )

(define-resource form-solution ()
  :class (s-prefix "ext:FormSolution")
  :properties `((:has-owner :string ,(s-prefix "ext:hasOwnerAsString")))
  :has-one `((form-node :via ,(s-prefix "ext:hasForm")
                        :as "form-node")
             (inzending-voor-toezicht :via ,(s-prefix "ext:hasInzendingVoorToezicht")
                                      :as "inzending-voor-toezicht"))
  :resource-base (s-url "http://data.lblod.info/form-solutions/")
  :on-path "form-solutions")

