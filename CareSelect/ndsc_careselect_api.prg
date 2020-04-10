DROP PROGRAM ndsc_careselect_api :dba GO
CREATE PROGRAM ndsc_careselect_api :dba
 DECLARE makerestcall ((requestbody = vc ) ,(calltype = vc ) ,(url = vc ) ,(token = vc ) ) = vc WITH
 persistscript
 SUBROUTINE  makerestcall (requestbody ,calltype ,url ,token )
  IF ((validate (debug_ind ,0 ) = 1 ) )
   SET url = "http://elliot.dev.transformativemed.com/acrselect-api/echo.php"
   CALL writehtml (build2 ("Request body: " ,requestbody ) )
   CALL writehtml (build2 ("Call type: " ,calltype ) )
   CALL writehtml (build2 ("URL: " ,url ) )
  ENDIF
  EXECUTE srvuri
  DECLARE stat = i4
  DECLARE cpm_http_transaction = i4 WITH protect ,constant (2000 )
  DECLARE http_success = i4 WITH protect ,constant (200 )
  DECLARE hheader = i4 WITH protect ,noconstant (0 )
  DECLARE hcustomheader = i4 WITH protect ,noconstant (0 )
  DECLARE hhttpmsg = i4 WITH protect ,noconstant (0 )
  DECLARE hhttpreq = i4 WITH protect ,noconstant (0 )
  DECLARE hhttprep = i4 WITH protect ,noconstant (0 )
  DECLARE nhttpstatus = i4 WITH protect ,noconstant (0 )
  DECLARE sresponse = vc WITH protect ,noconstant ("" )
  DECLARE nresponsesize = i4 WITH protect ,noconstant (0 )
  DECLARE nhttpstatus = i4 WITH private
  SET hhttpmsg = uar_srvselectmessage (cpm_http_transaction )
  SET hhttpreq = uar_srvcreaterequest (hhttpmsg )
  SET hhttprep = uar_srvcreatereply (hhttpmsg )
  SET stat = uar_srvsetstringfixed (hhttpreq ,"uri" ,url ,size (url ,1 ) )
  SET stat = uar_srvsetstringfixed (hhttpreq ,"method" ,calltype ,size (calltype ,1 ) )
  SET stat = uar_srvsetasis (hhttpreq ,"request_buffer" ,requestbody ,size (requestbody ,1 ) )
  SET hheader = uar_srvgetstruct (hhttpreq ,"header" )
  SET stat = uar_srvsetstringfixed (hheader ,"content_type" ,"application/json" ,size (
    "application/json" ,1 ) )
  SET hcustomheader = uar_srvadditem (hheader ,"custom_headers" )
  SET stat = uar_srvsetstringfixed (hcustomheader ,"name" ,"Authentication" ,size ("Authentication" ,
    1 ) )
  SET stat = uar_srvsetstringfixed (hcustomheader ,"value" ,token ,size (token ,1 ) )
  SET stat = uar_srvexecute (hhttpmsg ,hhttpreq ,hhttprep )
  SET nhttpstatus = uar_srvgetlong (hhttprep ,"http_status_code" )
  IF ((nhttpstatus != 200 ) )
   SET stat = uar_srvdestroyinstance (hhttpreq )
   SET stat = uar_srvdestroyinstance (hhttprep )
   SET stat = uar_srvdestroymessage (hhttpmsg )
   RETURN (sresponse )
  ENDIF
  SET nresponsesize = uar_srvgetasissize (hhttprep ,"response_buffer" )
  IF ((nresponsesize > 0 ) )
   SET sresponse = substring (1 ,nresponsesize ,uar_srvgetasisptr (hhttprep ,"response_buffer" ) )
  ENDIF
  SET stat = uar_srvdestroyinstance (hhttpreq )
  SET stat = uar_srvdestroyinstance (hhttprep )
  SET stat = uar_srvdestroymessage (hhttpmsg )
  RETURN (sresponse )
 END ;Subroutine
 DECLARE createsessions ((requestbody = vc ) ,(baseurl = vc ) ,(token = vc ) ) = vc WITH
 persistscript
 SUBROUTINE  createsessions (requestbody ,baseurl ,token )
  IF ((validate (debug_ind ,0 ) = 1 ) )
   CALL ndscloggingnocheck ("INSIDE NDSC CARESELECT API - CreateSessions" )
  ENDIF
  DECLARE url = vc
  SET url = build2 (baseurl ,"integration/cerner/sessions" )
  DECLARE sessionsresponse = vc
  SET sessionsresponse = makerestcall (requestbody ,"POST" ,url ,token )
  RETURN (sessionsresponse )
 END ;Subroutine
 DECLARE getindicationsessiondetails ((indicationmodetoken = vc ) ,(examid = vc ) ,(baseurl = vc ) ,(
  token = vc ) ) = vc WITH persistscript
 SUBROUTINE  getindicationsessiondetails (indicationmodetoken ,examid ,baseurl ,token )
  IF ((validate (debug_ind ,0 ) = 1 ) )
   CALL ndscloggingnocheck ("INSIDE NDSC CARESELECT API" )
  ENDIF
  DECLARE url = vc
  SET url = build2 (baseurl ,"integration/cerner/getindicationsessiondetails/{1}/{2}" )
  SET url = replace (url ,"{1}" ,indicationmodetoken ,1 )
  SET url = replace (url ,"{2}" ,examid ,1 )
  DECLARE getsessionsresponse = vc
  SET getsessionsresponse = makerestcall ("" ,"GET" ,url ,token )
  RETURN (getsessionsresponse )
 END ;Subroutine
 DECLARE getconfigs ((baseurl = vc ) ,(token = vc ) ) = vc WITH persistscript
 SUBROUTINE  getconfigs (baseurl ,token )
  IF ((validate (debug_ind ,0 ) = 1 ) )
   CALL ndscloggingnocheck ("INSIDE NDSC CARESELECT API" )
  ENDIF
  DECLARE url = vc
  SET url = build2 (baseurl ,"integration/cerner/configurations" )
  DECLARE configresponse = vc
  SET configresponse = makerestcall ("" ,"GET" ,url ,token )
  RETURN (configresponse )
 END ;Subroutine
 DECLARE generaterecommendations ((requestbody = vc ) ,(siteid = vc ) ,(baseurl = vc ) ,(token = vc
  ) ) = vc WITH persistscript
 SUBROUTINE  generaterecommendations (requestbody ,siteid ,baseurl ,token )
  DECLARE url = vc
  SET url = build2 (baseurl ,"integration/cerner/site/{2}/multipleRecommendations" )
  SET url = replace (url ,"{2}" ,siteid ,1 )
  IF ((validate (debug_ind ,0 ) = 1 ) )
   CALL ndscloggingnocheck (build2 ("NDSC DISCERN RECOMMENDATION URL: " ,url ) )
  ENDIF
  DECLARE recommendationsresponse = vc
  SET recommendationsresponse = makerestcall (requestbody ,"POST" ,url ,token )
  IF ((validate (debug_ind ,0 ) = 1 ) )
   CALL ndscloggingnocheck (build2 ("NDSC DISCERN RECOMMENDATION RESPONSE: " ,
     recommendationsresponse ) )
  ENDIF
  RETURN (recommendationsresponse )
 END ;Subroutine
 DECLARE getorderdata ((requestbody = vc ) ,(siteid = vc ) ,(baseurl = vc ) ,(token = vc ) ) = vc
 WITH persistscript
 SUBROUTINE  getorderdata (requestbody ,siteid ,baseurl ,token )
  DECLARE url = vc
  SET url = build2 (baseurl ,"integration/CernerOrder/GetOrderData?ids=" ,requestbody ,"&siteId=" ,
   siteid ,"&isDsn=true" )
  DECLARE response = vc
  SET response = makerestcall (requestbody ,"GET" ,url ,token )
  RETURN (response )
 END ;Subroutine
 DECLARE updateorderid ((requestbody = vc ) ,(baseurl = vc ) ,(token = vc ) ) = vc WITH
 persistscript
 SUBROUTINE  updateorderid (requestbody ,baseurl ,token )
  DECLARE url = vc
  SET url = build2 (baseurl ,"api/Integration/CernerOrder/UpdateOrderId" )
  DECLARE newresponse = vc
  SET newresponse = makerestcall (requestbody ,"POST" ,url ,token )
  RETURN (newresponse )
 END ;Subroutine
 DECLARE uploadvirtualviews ((requestbody = vc ) ,(baseurl = vc ) ,(token = vc ) ) = vc WITH
 persistscript
 SUBROUTINE  uploadvirtualviews (requestbody ,baseurl ,token )
  DECLARE url = vc
  SET url = build2 (baseurl ,"api/integration/Upload/CernerOrderVirtualView/Upload" )
  DECLARE response = vc
  SET response = makerestcall (requestbody ,"POST" ,url ,token )
  RETURN (response )
 END ;Subroutine
 DECLARE uploadordercatalog ((requestbody = vc ) ,(baseurl = vc ) ,(token = vc ) ) = vc WITH
 persistscript
 SUBROUTINE  uploadordercatalog (requestbody ,baseurl ,token )
  DECLARE url = vc
  SET url = build2 (baseurl ,"api/integration/Upload/CernerOrderCatalog/Upload" )
  DECLARE response = vc
  SET response = makerestcall (requestbody ,"POST" ,url ,token )
  RETURN (response )
 END ;Subroutine
 DECLARE uploadorderables ((requestbody = vc ) ,(baseurl = vc ) ,(token = vc ) ) = vc WITH
 persistscript
 SUBROUTINE  uploadorderables (requestbody ,baseurl ,token )
  DECLARE url = vc
  SET url = build2 (baseurl ,"api/integration/Upload/CernerOrderOrderable/Upload" )
  DECLARE response = vc
  SET response = makerestcall (requestbody ,"POST" ,url ,token )
  RETURN (response )
 END ;Subroutine
 DECLARE uploadformats ((requestbody = vc ) ,(baseurl = vc ) ,(token = vc ) ) = vc WITH
 persistscript
 SUBROUTINE  uploadformats (requestbody ,baseurl ,token )
  DECLARE url = vc
  SET url = build2 (baseurl ,"api/Integration/Upload/CernerOrderQuestions/Upload" )
  DECLARE response = vc
  SET response = makerestcall (requestbody ,"POST" ,url ,token )
  RETURN (response )
 END ;Subroutine
 DECLARE uploadordercodes ((requestbody = vc ) ,(baseurl = vc ) ,(token = vc ) ) = vc WITH
 persistscript
 SUBROUTINE  uploadordercodes (requestbody ,baseurl ,token )
  DECLARE url = vc
  SET url = build2 (baseurl ,"api/integration/Upload/CernerOrderCodeValue/Upload" )
  DECLARE response = vc
  SET response = makerestcall (requestbody ,"POST" ,url ,token )
  RETURN (response )
 END ;Subroutine
 DECLARE uploadorders ((requestbody = vc ) ,(baseurl = vc ) ,(token = vc ) ) = vc WITH persistscript
 SUBROUTINE  uploadorders (requestbody ,baseurl ,token )
  DECLARE url = vc
  SET url = build2 (baseurl ,"api/integration/Upload/CernerOrderExtract/Upload" )
  DECLARE response = vc
  SET response = makerestcall (requestbody ,"POST" ,url ,token )
  RETURN (response )
 END ;Subroutine
END GO