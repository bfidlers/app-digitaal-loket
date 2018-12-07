(define-resource mailbox ()
  :class (s-prefix "nmo:Mailbox")
  :properties `((:id :string ,(s-prefix "nie:identifier")))
  :has-many `((folder :via ,(s-prefix "fni:hasPart")
                    :as "folders"))
  :resource-base (s-url "http://data.lblod.info/id/mailboxes/")
  :features '(include-uri)
  :on-path "mailboxes")

(define-resource folder ()
  :class (s-prefix "nfo:Folder")
  :properties `((:name :string ,(s-prefix "nie:title"))
                (:description :string ,(s-prefix "nie:description")))
  :has-many `((email :via ,(s-prefix "email:hasEmail");;hack, as mu-cl-resources doesn't support superclasses yet (http://oscaf.sourceforge.net/nmo.html#nmo:MailboxDataObject)
                    :as "emails")
             (folder :via ,(s-prefix "email:hasFolder");;hack, as mu-cl-resources doesn't support superclasses yet (http://oscaf.sourceforge.net/nmo.html#nmo:MailboxDataObject)
                    :as "folders"))
  :resource-base (s-url "http://data.lblod.info/id/mail-folders/")
  :features '(include-uri)
  :on-path "mail-folders")

(define-resource email ()
  :class (s-prefix "nmo:Email")
  :properties `((:message-id :string ,(s-prefix "nmo:messageId"));; e-mail protocol-specific id: https://tools.ietf.org/html/rfc2822#section-3.6.4
                (:from :string ,(s-prefix "nmo:messageFrom"))
                (:to :string ,(s-prefix "nmo:emailTo"))
                (:cc :string ,(s-prefix "nmo:emailCc"))
                (:bcc :string ,(s-prefix "nmo:emailBcc"))
                (:subject :string ,(s-prefix "nmo:messageSubject"))
                (:content :string ,(s-prefix "nmo:plainTextMessageContent"))
                (:html-content :string ,(s-prefix "nmo:htmlMessageContent"))
                (:is-read :boolean ,(s-prefix "nmo:isRead"))
                (:content-mime-type :string ,(s-prefix "nmo:contentMimeType"))
                (:received-date :datetime ,(s-prefix "nmo:receivedDate"))
                (:sent-date :datetime ,(s-prefix "nmo:sentDate")))
  :has-one `((email :via ,(s-prefix "nmo:inReplyTo")
                    :as "in-reply-to")
             (folder :via ,(s-prefix "nmo:isPartOf")
                                   :inverse t
                                   :as "folder"))
  :has-many `((email-header :via ,(s-prefix "nmo:messageHeader")
                    :as "headers")
              (file :via ,(s-prefix "nmo:hasAttachment")
                    :as "attachments"))
  ;           (email :via ,(s-prefix "nmo:references");;https://tools.ietf.org/html/rfc2822#section-3.6.4
  ;                   :as "references"))
  :resource-base (s-url "http://data.lblod.info/id/emails/")
  :features '(include-uri)
  :on-path "emails")

(define-resource email-header ()
  :class (s-prefix "nmo:MessageHeader")
  :properties `((:header-name :string ,(s-prefix "nmo:headerName"))
                (:header-value :string ,(s-prefix "nmo:headerValue")))
  :has-one `((email :via ,(s-prefix "nmo:messageHeader")
                         :inverse t
                         :as "email"))
  :resource-base (s-url "http://data.lblod.info/id/email-headers/")
  :features '(include-uri)
  :on-path "email-headers")
