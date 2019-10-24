<?xml version="1.0" encoding="UTF-8"?><!-- DWXMLSource="CCD/Proposed/ADAM EVERYMAN Transition_of_Care_Referral_Summary.xml" -->
<!--
  Title: CDA XSL StyleSheet
  Original Filename: cda.xsl 
  Version: 3.0
  Revision History: 8/12/09 Jingdong Li updated 
  Specification: HL7 CDAR2  
  The current version and documentation are available at www.alschulerassociates.com/cda/?topic=cda-tools. 
  We welcome feedback to tools@alschulerassociates.com
  The stylesheet is the cumulative work of several developers; the most significant prior milestones were the foundation work from HL7 
  Germany and Finland (Tyylitiedosto) and HL7 US (Calvin Beebe), and the presentation approach from Tony Schaller, medshare GmbH provided at IHIC 2009. 
-->
<xsl:stylesheet version="1.1" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:n1="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:exslt="http://exslt.org/common" xmlns:msxsl="urn:schemas-microsoft-com:xslt">
	<xsl:output method="html" indent="yes" version="4.01" encoding="ISO-8859-1" doctype-system="http://www.w3.org/TR/html4/strict.dtd" doctype-public="-//W3C//DTD HTML 4.01//EN"/>
	<!-- NOTE: Unfortunatly using "this" breaks XMLSpy. -->
    <xsl:variable name="lc" select="'abcdefghijklmnopqrstuvwxyz'" />
    <xsl:variable name="uc" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
    <xsl:variable name="simple-sanitizer-match"><xsl:text>&#10;&#13;&#34;&#39;&#58;&#59;&#63;&#96;&#123;&#125;&#8220;&#8221;&#8222;&#8218;&#8217;</xsl:text></xsl:variable>
    <xsl:variable name="simple-sanitizer-replace" select="'***************'"/>
    <xsl:variable name="javascript-injection-warning">WARNING: Javascript injection attempt detected in source CDA document. Terminating</xsl:variable>
    <xsl:variable name="malicious-content-warning">WARNING: Potentially malicious content found in CDA document.</xsl:variable>

	<msxsl:script language="JScript" implements-prefix="exslt">
	<!--	this['node-set'] =  function func(x) {return x;} -->
	</msxsl:script>
	
	<!-- global variable title -->
	<xsl:variable name="title">
		<xsl:choose>
			<xsl:when test="string-length(/n1:ClinicalDocument/n1:title)  &gt;= 1">
				<xsl:value-of select="/n1:ClinicalDocument/n1:title"/>
			</xsl:when>
			<xsl:when test="/n1:ClinicalDocument/n1:code/@displayName">
				<xsl:value-of select="/n1:ClinicalDocument/n1:code/@displayName"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>Clinical Document</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
  
  <!-- global variable orgName-->
  <xsl:variable name="orgName">
    <xsl:value-of select="/n1:ClinicalDocument/n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name"/>
  </xsl:variable>
  
  <!-- global variable encounterLocation-->
  <xsl:variable name="encounterLocation">
    <xsl:value-of select="/n1:ClinicalDocument/n1:componentOf/n1:encompassingEncounter/n1:location/n1:healthCareFacility/n1:location/n1:name"/>
  </xsl:variable>
  
	<!-- Main -->
	<xsl:template match="/">
		<xsl:apply-templates select="n1:ClinicalDocument"/>
	</xsl:template>
	<!-- produce browser rendered, human readable clinical document	-->
	<xsl:template match="n1:ClinicalDocument">
		<html>
			<head>
        <!-- Using IE 8 standards will prevent page-break between the medication and the dosage in the Medications and the Medications Administered during your visit section -->
        <meta http-equiv="x-ua-compatible" content="IE=8" />
        <xsl:comment> Do NOT edit this HTML directly: it was generated via an XSLT transformation from a CDA Release 2 XML document. </xsl:comment>
				<title>
					<xsl:value-of select="$title"/>
				</title>
				<!-- <link rel="stylesheet" type="text/css" href="cda.css"/> -->
<style type="text/css" media="screen">
<xsl:text>
	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
margin: 0;
padding: 0;
border: 0;
font-size: 100%;
font: inherit;
vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
display: block;
}
body {
line-height: 1;
}
ol, ul {
list-style: none;
}
blockquote, q {
quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
content: '';
content: none;
}
table {
border-collapse: collapse;
border-spacing: 0;
}

<!-- -->

.page-break	{display: none;}


body,html {
	margin:0;
	height:100%;
	width:100%;
}
.wrap{margin:0;
width:100%;
height:100%;}

.document{overflow:auto;right:30px;top:30px;left:30px;bottom:30px;position:fixed;background-color:#F8F8F8;padding-top:25px;padding-left:50px;padding-right:50px;border:solid 1px #C3C7CA;-moz-box-shadow:0px 0px 12px rgba(0,0,0,0.25) ,inset 0px 1px 0px rgb(255,255,255) ,inset 0px -1px 0px rgb(195,199,202);-webkit-box-shadow:0px 0px 12px rgba(0,0,0,0.25) ,inset 0px 1px 0px rgb(255,255,255) ,inset 0px -1px 0px rgb(195,199,202);box-shadow:0px 0px 12px rgba(0,0,0,0.25) ,inset 0px 1px 0px rgb(255,255,255) ,inset 0px -1px 0px rgb(195,199,202);


/*-ms-filter:"progid:DXImageTransform.Microsoft.dropshadow(OffX=0,OffY=0,Color=#40000000,Positive=true)";filter:progid:DXImageTransform.Microsoft.dropshadow(OffX=0,OffY=0,Color=#40000000,Positive=true);-ms-filter:"progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#000000')";filter: progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#000000');*/


}
<!--h1{text-align:center; font-weight:100;font-size:24px;color:#333333;display:block;border:1px solid #E1E3E5;padding-bottom:10px;}-->
.title_header{text-align:center; font-weight:100;font-size:24px;color:#999999;display:block;padding-bottom:10px;text-shadow: 4px 4px 4px #FFF;}
<!--h4 a{text-decoration:none; font-family:Helvetica, Arial, sans-serif;font-weight:100;font-size:20px;color:#333333;display:inline;} -->
.section_title a{text-decoration:none; font-family:Helvetica, Arial, sans-serif;font-weight:bold;font-size:18px;color:#333333;display:block;padding:4px;width:100%;border-bottom:1px solid #E1E3E5;}
.section_item {float:left; clear:left;width:100%;}
body{background-color:#E1E3E5;font-size:15px; font-family:Helvetica, Arial, sans-serif;}
.clearfix {clear:both;}
.backToTop{text-decoration:none;font-size:10px;margin-top:15px;margin-left:0px; color:#999;}
.td_label{color:#999999;font-size:13px;font-weight:100;}
.narr_table{border:none;text-align:left; margin-bottom:10px; width:100%; margin-top:10px;}
.narr_table thead{color:#797979;font-size:13px;}
.narr_table td{border:none;}
.narr_table tr{margin-bottom:20px;}
.narr_th{border:none;text-align:left; font-weight:100;color:#999999; font-size:13px;}
.header_table{width:100%; text-align:left;}
.header_table td{padding-top:0px;margin-bottom:15px;width:40%;}
.spacer{border-top:1px solid #FFFFFF;padding-top:15px;}
tbody {width:100%; font-size:15px; vertical-align:top;}
#toc a{text-decoration:none;color:#FFFFFF;}
#toc a:hover{text-decoration:underline;}
#toc ul{list-style:none;padding:0;margin:0;}
#toc ul li{padding-bottom:10px;}
#toc h2{display:none;}
td {line-height:20px;}
.title{border-top:1px solid #E1E3E5;margin-top:30px;}
.narr_tr td{line-height:1.25; vertical-align:top; padding:5px;}
.Bold{font-weight:bold;}
.Italics{font-style:italic;}
.Underline{text-decoration:underline;}

sup {position: relative;top: -0.5em;}
sub {position: relative; bottom: -0.25em;}

<!--LIST ICON RENDERING-->

#toc {height:40px; width:40px; background-color: #40454A;overflow:hidden;position:fixed;left:30px;top:0;font-size:13px;margin-top:64px;opacity: 1;}
.icon {margin:8px;height:30px;width:40px;}
.dot {height: 2px;width: 2px;margin-top: 4px;background-color: #FFFFFF; float:left;clear:left;}
.line {height: 2px;width: 19px;margin-top: 4px;margin-left: 2px;background-color: #FFFFFF;float:left;}

#toc:hover .icon{display:none;}
#toc:hover {width:167px; height:400px; padding-left:10px; padding-top:20px; padding-bottom:10px;
<!-- filter: Alpha(Opacity=85);-->
opacity: 0.85;

transition:All .5s ease-in-out;
transition:All .5s ease-in-out;
-webkit-transition:All .5s ease-in-out;
-moz-transition:All .5s ease-in-out;
-o-transition:All .5s ease-in-out;
transform: rotate(0deg) scale(1) skew(0deg) translate(0px);
-webkit-transform: rotate(0deg) scale(1) skew(0deg) translate(0px);
-moz-transform: rotate(0deg) scale(1) skew(0deg) translate(0px);
-o-transform: rotate(0deg) scale(1) skew(0deg) translate(0px);
-ms-transform: rotate(0deg) scale(1) skew(0deg) translate(0px);}

</xsl:text>
</style>
                
<style type="text/css" media="print">
  
  <!-- CSS RESET BEGINS-->

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
  display: block;
  }
  body {
  line-height: 1;
  }
  ol, ul {
  list-style: none;
  }
  blockquote, q {
  quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
  content: '';
  content: none;
  }
  table {
  border-collapse: collapse;
  border-spacing: 0;
  }
  
  <!-- CSS RESET ENDS -->
  
  .page-break	{ display: block; page-break-before: always; clear:both;}

  body,html {
  margin:0;
  height:100%;
  width:100%;
  }
  .wrap{margin:0;
  width:100%;
  height:100%;}

  #toc {display:none;}
  <!--h1{text-align:center; font-weight:100;font-size:24px;color:#333333;display:block;}-->
  .title_header{text-align:center; font-weight:100;font-size:18px;color:#333333;display:block;margin-bottom:4px;text-shadow: 4px 4px 4px #FFF;}
  <!--h4 a{text-decoration:none; font-family:Helvetica, Arial, sans-serif;font-weight:100;font-size:20px;color:#333333;display:inline;} -->

  .section_title a{text-decoration:none; font-family:Helvetica, Arial, sans-serif;font-weight:bold;font-size:18px;color:#333333;display:block;padding:4px;width:100%;border-bottom:1px solid #E1E3E5; clear:both;}
  .narr_table{border:none;text-align:left; width:100%;}
  .narr_table thead{color:#797979;font-size:13px;}
  .narr_table td{border:none;}
  .narr_th{border:none;text-align:left; font-weight:100;color:#505050; font-size:13px;}
  .header_table{width:100%; text-align:left;}
  .header_table td{width:40%;}
  .td_label{color:#999999;font-size:13px;font-weight:100;}
  <!--.document{ background-color:#FFFFFF;width:100}-->

  .document{background-color:#FFFFFF;width:100%;height:50%;margin-bottom:20px;padding-bottom:20px;}
  .clearfix {display:none;}
  .backToTop {display:none;}
  body{margin:0;background-color:#FFFFFF;font-size:15px; font-family:Helvetica, Arial, sans-serif;font-weight:100;width:100%;}
  td {line-height:20px;}
  .title{border-top:1px solid #E1E3E5;margin-top:30px;}
  .narr_tr td{line-height:1.25; vertical-align:top;padding:5px;}
  div {
  background-color:#FFFFFF;
  }
  .Bold{font-weight:bold;}
  .Italics{font-style:italic;}
  .Underline{text-decoration:underline;}
  #mainDiv{width:100%; display:block;}
  sup {position: relative;top: -0.5em;}
  sub {position: relative; bottom: -0.25em;}

/* css for the footer */
  #footer {
  display: block;
  width: 100%;
  border-top:1px solid #E1E3E5;
  border-bottom:1px solid #E1E3E5;
  height:20px;
  }

  #footer td {
  border: none;
  font-size:12px;
  font-weight: bold;
  }

  /* prevent page-break in the medications section */
  [id = '2\.16\.840\.1\.113883\.10\.20\.22\.2\.1'] ~ table tr { page-break-inside: avoid; }
  [id = '2\.16\.840\.1\.113883\.10\.20\.22\.2\.1'] ~ p { page-break-inside: avoid; }

  /* prevent page-break in the medications administered during your visit section */
  [id = '2\.16\.840\.1\.113883\.10\.20\.22\.2\.38'] ~ table tr { page-break-inside: avoid; }
  [id = '2\.16\.840\.1\.113883\.10\.20\.22\.2\.38'] ~ p { page-break-inside: avoid; }

</style>
			</head>
			<body>
            <div class="wrap">
            <div class="document">
            <a name="top"></a>

        <!-- Display the value of encounter location or organization name when returned in the XML -->
        <span class="title_header">
          <span style="text-align:center; display:inline;">
            <xsl:value-of select="$title"/>
			<xsl:choose>
				<xsl:when test="$encounterLocation != ''">
				  | <xsl:value-of select="$encounterLocation"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:if test="$orgName != ''">
						| <xsl:value-of select="$orgName"/>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
          </span>
        </span>
              
				<!-- START display top portion of clinical document -->
				<xsl:call-template name="recordTarget"/>
              
				<!-- END display top portion of clinical document -->
				<!-- produce table of contents -->
				<xsl:call-template name="make-tableofcontents"/>
				
				<!-- produce human readable document content -->
				<xsl:apply-templates select="n1:component/n1:structuredBody|n1:component/n1:nonXMLBody"/>
				<br/>

 <!-- If medication section is not the last section then display details as the last one -->
     <xsl:variable name= "sectionID" select="/n1:ClinicalDocument/n1:component/n1:structuredBody/n1:component[last()]/n1:section/n1:templateId/@root"/>
              <xsl:if test="not($sectionID = '2.16.840.1.113883.10.20.22.2.1') or not($sectionID = '2.16.840.1.113883.10.20.22.2.1.1')">
                <xsl:call-template name="documentGeneral"/>
                <!--        <xsl:call-template name="author"/>-->
                <xsl:call-template name="careTeam"/>
                <xsl:call-template name="participant"/>
                <xsl:call-template name="dataEnterer"/>
                <xsl:call-template name="authenticator"/>
                <xsl:call-template name="informant"/>
                <xsl:call-template name="informationRecipient"/>
                <xsl:call-template name="legalAuthenticator"/>
              </xsl:if>
<!--				<xsl:call-template name="custodian"/>-->
<!--        <hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/>-->
                </div>

                </div>
                			
			</body>
		</html>
	</xsl:template>
	<!-- generate table of contents -->
	<xsl:template name="make-tableofcontents">
    <div id="toc">
    <div class="icon">
	    <div class="dot"></div><div class="line"></div>
	    <div class="dot"></div><div class="line"></div>
	    <div class="dot"></div><div class="line"></div>
	  </div>
		<h2>
			<a name="toc">Table of Contents</a>
		</h2>
		<ul>
			<xsl:for-each select="n1:component/n1:structuredBody/n1:component/n1:section/n1:title">
				<li>
					<a href="#{generate-id(.)}">
						<xsl:value-of select="."/>
					</a>
				</li>
			</xsl:for-each>
		</ul>
        </div>
	</xsl:template>
	<!-- header elements -->
	
    
<!-- BEGIN PATIENT DEMOGRAPHICS -->
        
<!-- recordTarget -->


	<xsl:template name="recordTarget">

		<div style="width:100%; padding:8px;color:#000000;margin-bottom:16px;font-weight:medium; font-size:16px;border-top:1px solid #E1E3E5;border-bottom:1px solid #E1E3E5;">
			<!--<hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/>-->

			<xsl:for-each select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole">

				<!-- NAME -->
        <div>
          <span style="font-weight:bold;font-size:24px;">
            <xsl:call-template name="show-name">
              <xsl:with-param name="name" select="n1:patient/n1:name"/>
            </xsl:call-template>
          </span>
        </div>

        <div>
				  <!-- Race -->
				  <span style="font-size:17px;font-weight:regular;padding-right:4px;">
					  <xsl:text>Race: </xsl:text>
					  <xsl:choose>
						  <xsl:when test="n1:patient/n1:raceCode">
							  <xsl:for-each select="n1:patient/n1:raceCode">
								  <xsl:call-template name="show-race-ethnicity"/>
							  </xsl:for-each>
							  <xsl:for-each select="n1:patient/sdtc:raceCode">
								  <xsl:call-template name="show-race-ethnicity-list"/>
							  </xsl:for-each>
						  </xsl:when>
					  </xsl:choose>
					  <xsl:text> | </xsl:text>
				  </span>

				  <!-- Ethnicity -->

				  <span style="font-size:17px;font-weight:regular;padding-right:4px;">
					  <xsl:text>Ethnicity: </xsl:text>
					  <xsl:if test="n1:patient/n1:raceCode | (n1:patient/n1:ethnicGroupCode)">
						  <xsl:choose>
							  <xsl:when test="n1:patient/n1:ethnicGroupCode">
								  <xsl:for-each select="n1:patient/n1:ethnicGroupCode">
									  <xsl:call-template name="show-race-ethnicity"/>
								  </xsl:for-each>
							  </xsl:when>
						  </xsl:choose>
					  </xsl:if>
					  <xsl:text> | </xsl:text>
				  </span>

				  <!-- SEX -->

				  <span style="font-size:17px;font-weight:regular;padding-right:4px;">
					  <xsl:text>Sex: </xsl:text>
					  <xsl:for-each select="n1:patient/n1:administrativeGenderCode">
						  <xsl:call-template name="show-sex"/>
					  </xsl:for-each>
					  <xsl:text> | </xsl:text>
				  </span>

				  <!-- DOB -->

				  <span style="font-size:17px;font-weight:regular;padding-right:4px;">
					  <xsl:text>DOB: </xsl:text>
					  <xsl:if test="not(n1:patient/n1:birthTime/@nullFlavor)">
						  <xsl:call-template name="show-time">
							  <xsl:with-param name="datetime" select="n1:patient/n1:birthTime"/>
						  </xsl:call-template>
					  </xsl:if>
					  <xsl:text> | </xsl:text>
				  </span>

				  <!-- LANGUAGE -->

				  <span style="font-size:17px;font-weight:regular;">
					  <xsl:text>Language: </xsl:text>
					  <xsl:choose>
						  <xsl:when test="n1:patient/n1:languageCommunication/n1:languageCode">
							  <xsl:for-each select="n1:patient/n1:languageCommunication/n1:languageCode">
								  <xsl:call-template name="show-preferred-language"/>
							  </xsl:for-each>
						  </xsl:when>
					  </xsl:choose>
				  </span>
        </div>

        <div>
          <!-- PATIENT ID'S -->
          <span style="font-size:12px;font-weight:regular;padding-top:3px;">
            <xsl:text>Patient IDs: </xsl:text>
            <xsl:for-each select="n1:id">
              <xsl:if test="position() &gt; 1">
                <xsl:text>,</xsl:text>
              </xsl:if>
              <xsl:call-template name="show-id"/>
            </xsl:for-each>
          </span>
        </div>

			</xsl:for-each>
			<div style="clear:both;"></div>
		</div>
	</xsl:template>
		
<!-- END PATIENT DEMOGRAPHICS -->
    
	<!-- relatedDocument -->
	<xsl:template name="relatedDocument">
		<xsl:if test="n1:relatedDocument">
        <!--<hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/>-->
			<table class="header_table">
				<tbody>
					<xsl:for-each select="n1:relatedDocument">
						<tr>
							<td>
								<span class="td_label">
									<xsl:text>Related document</xsl:text>
								</span>
							</td>
							<td>
								<xsl:for-each select="n1:parentDocument">
									<xsl:for-each select="n1:id">
										<xsl:call-template name="show-id"/>
										<br/>
									</xsl:for-each>
								</xsl:for-each>
							</td>
						</tr>
					</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<!-- authorization (consent) -->
	<xsl:template name="authorization">
		<xsl:if test="n1:authorization">
        <!--<hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/>-->
			<table class="header_table">
				<tbody>
					<xsl:for-each select="n1:authorization">
						<tr>
							<td>
								<span class="td_label">
									<xsl:text>Consent</xsl:text>
								</span>
							</td>
							<td>
								<xsl:choose>
									<xsl:when test="n1:consent/n1:code">
										<xsl:call-template name="show-code">
											<xsl:with-param name="code" select="n1:consent/n1:code"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:call-template name="show-code">
											<xsl:with-param name="code" select="n1:consent/n1:statusCode"/>
										</xsl:call-template>
									</xsl:otherwise>
								</xsl:choose>
								<br/>
							</td>
						</tr>
					</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<!-- setAndVersion -->
	<xsl:template name="setAndVersion">
		<xsl:if test="n1:setId and n1:versionNumber">
        <!--<hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/>-->
			<table class="header_table">
				<tbody>
					<tr>
						<td>
							<xsl:text>SetId and Version</xsl:text>
						</td>
						<td>
							<xsl:text>SetId: </xsl:text>
							<xsl:call-template name="show-id">
								<xsl:with-param name="id" select="n1:setId"/>
							</xsl:call-template>
							<xsl:text>  Version: </xsl:text>
							<xsl:value-of select="n1:versionNumber/@value"/>
						</td>
					</tr>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<!-- show StructuredBody 	-->
	<xsl:template match="n1:component/n1:structuredBody">
		<xsl:for-each select="n1:component/n1:section">
			<xsl:call-template name="section"/>
		</xsl:for-each>
	</xsl:template>
	<!-- show nonXMLBody -->
	<xsl:template match='n1:component/n1:nonXMLBody'>
		<xsl:choose>
			<!-- if there is a reference, use that in an IFRAME -->
			<xsl:when test='n1:text/n1:reference'>
 		<xsl:variable name="source" select="string(n1:text/n1:reference/@value)"/>
                <xsl:variable name="lcSource" select="translate(doc, $lc, $uc)"/>
                <xsl:variable name="scrubbedSource" select="translate($source, $simple-sanitizer-match, $simple-sanitizer-replace)"/>
                <xsl:choose>
                    <xsl:when test="contains($lcSource,'javascript')">
                        <p><xsl:value-of select="$javascript-injection-warning"/> </p>
                        <xsl:message><xsl:value-of select="$javascript-injection-warning"/></xsl:message>
                    </xsl:when>
                    <xsl:when test="not($source = $scrubbedSource)">
                        <p><xsl:value-of select="$malicious-content-warning"/> </p>
                        <xsl:message><xsl:value-of select="$malicious-content-warning"/></xsl:message>
                    </xsl:when>
                    <xsl:otherwise>
				<IFRAME name='nonXMLBody' id='nonXMLBody' WIDTH='80%' HEIGHT='66%' src='{n1:text/n1:reference/@value}'/>
			    </xsl:otherwise>
                </xsl:choose>
			</xsl:when>
			<xsl:when test='n1:text/@mediaType="text/plain"'>
				<pre>
					<xsl:value-of select='n1:text/text()'/>
				</pre>
			</xsl:when>
			<xsl:otherwise>
				<CENTER>Cannot display the text</CENTER>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- top level component/section: display title and text,
     and process any nested component/sections
	 -->
	<xsl:template name="section">
		<xsl:call-template name="section-title">
			<xsl:with-param name="title" select="n1:title"/>
		</xsl:call-template>
		<xsl:call-template name="section-author"/>
		<xsl:call-template name="section-text"/>
		<xsl:for-each select="n1:component/n1:section">
			<xsl:call-template name="nestedSection">
				<xsl:with-param name="margin" select="2"/>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>
	<!-- top level section title -->
	<xsl:template name="section-title">
		<xsl:param name="title"/>
        <div class="clearfix"></div>
        <a class="backToTop" href="#top" title="Back to Top">Back to Top</a>
        <!--<hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/>-->
    <!-- This prints the Medications on a separate page-->
    <xsl:variable name="temptitle">
      <xsl:value-of select="n1:templateId/@root"/>
    </xsl:variable>
    <xsl:variable name="paragraph_id">
      <xsl:value-of select="n1:text/n1:paragraph/@ID"/>
    </xsl:variable>
    <xsl:variable name="content_id">
      <xsl:value-of select="n1:text/n1:paragraph/n1:content/@ID"/>
    </xsl:variable>
    <!-- If we are in medications section call checksection template to check if medications is last one -->
    <xsl:if test="$temptitle = '2.16.840.1.113883.10.20.22.2.1' or $temptitle = '2.16.840.1.113883.10.20.22.2.1.1'">
      <xsl:call-template name="checksection"/>
    </xsl:if>
    <!-- 
      having a content tag with id of NOMEDINFO signifies that there are no medications associated with patient as defined by FSI.
      having a paragraph_id of MEDPRODKP means that there are no known medications "found" (including no known home meds) as defined by FSI.
      having a paragraph_id of NODATAAVAILABLE means that this section is empty, as defined by Powerchart mPage team.
    -->
    <xsl:variable name="apply_page_break" select="$content_id!='NOMEDINFO' and $paragraph_id!='MEDPRODNKP' and $paragraph_id!='NODATAAVAILABLE'"></xsl:variable>

    <!-- The temptitle values indicate the values for Medication as the name Medication may vary for each client these values are consistent-->
    <xsl:if test="$temptitle = '2.16.840.1.113883.10.20.22.2.1.1' and boolean($apply_page_break)">
      <div class="clearfix"></div>
      <div class="page-break"></div>
    </xsl:if>
    <xsl:if test="$temptitle = '2.16.840.1.113883.10.20.22.2.1' and boolean($apply_page_break)">
      <div class="clearfix"></div>
      <div class="page-break"></div>
    </xsl:if>
    
		<span class="section_title">
			<a name="{generate-id($title)}" href="#toc">
				<xsl:value-of select="$title"/>
			</a>
		</span>
        
         
	</xsl:template>
	<!-- section author -->
	<xsl:template name="section-author">
		<xsl:if test="count(n1:author)&gt;0">
			<div>
				<b>
					<xsl:text>Section Author: </xsl:text>
				</b>
				<xsl:for-each select="n1:author/n1:assignedAuthor">
					<xsl:choose>
						<xsl:when test="n1:assignedPerson/n1:name">
							<xsl:call-template name="show-name">
								<xsl:with-param name="name" select="n1:assignedPerson/n1:name"/>
							</xsl:call-template>
							<xsl:if test="n1:representedOrganization">
								<xsl:text>, </xsl:text>
								<xsl:call-template name="show-name">
									<xsl:with-param name="name" select="n1:representedOrganization/n1:name"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:when>
						<xsl:when test="n1:assignedAuthoringDevice/n1:softwareName">
							<xsl:value-of select="n1:assignedAuthoringDevice/n1:softwareName"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:for-each select="n1:id">
								<xsl:call-template name="show-id"/>
								<br/>
							</xsl:for-each>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
				<br/>
			</div>
		</xsl:if>
	</xsl:template>
	<!-- top-level section Text   -->
	<xsl:template name="section-text">
    <!-- This prints the Medications on a separate page-->
    <xsl:variable name="temptitle">
      <xsl:value-of select="n1:templateId/@root"/>
    </xsl:variable>
    <xsl:variable name="paragraph_id">
      <xsl:value-of select="n1:text/n1:paragraph/@ID"/>
    </xsl:variable>
    <xsl:variable name="content_id">
      <xsl:value-of select="n1:text/n1:paragraph/n1:content/@ID"/>
    </xsl:variable>
    <!-- 
      having a content tag with id of NOMEDINFO signifies that there are no medications associated with patient as defined by FSI.
      having a paragraph_id of MEDPRODKP means that there are no known medications "found" (including no known home meds) as defined by FSI.
      having a paragraph_id of NODATAAVAILABLE means that this section is empty, as defined by Powerchart mPage team.
    -->
    <xsl:variable name="apply_page_break" select="$content_id!='NOMEDINFO' and $paragraph_id!='MEDPRODNKP' and $paragraph_id!='NODATAAVAILABLE'"></xsl:variable>
      
		<div>
			<xsl:call-template name="section-title-span">
				<xsl:with-param name="title" select="n1:title"/>
        <xsl:with-param name="id" select="$temptitle"/>
			</xsl:call-template>
			<xsl:apply-templates select="n1:text"/>
		</div>
    <!-- If medications section is the last section we don't need page break at end as this will add additional white page -->
    <xsl:variable name= "sectionID" select="/n1:ClinicalDocument/n1:component/n1:structuredBody/n1:component[last()]/n1:section/n1:templateId/@root"/>
    <xsl:if test="not($sectionID = '2.16.840.1.113883.10.20.22.2.1') or not($sectionID = '2.16.840.1.113883.10.20.22.2.1.1')">
      <!-- The temptitle values indicate the values for Medication as the name Medication may vary for each client these values are consistent-->
      <xsl:if test="$temptitle = '2.16.840.1.113883.10.20.22.2.1.1' and boolean($apply_page_break)">
        <div class="page-break"></div>
      </xsl:if>
      <xsl:if test="$temptitle = '2.16.840.1.113883.10.20.22.2.1' and boolean($apply_page_break)">
        <div class="page-break"></div>
      </xsl:if>
    </xsl:if>
	</xsl:template>
  
  <!-- This template checks if Medication is last section if it is then it will call to display Details section before medications -->
    <xsl:template name="checksection">
    <xsl:param name= "sectionID" select="/n1:ClinicalDocument/n1:component/n1:structuredBody/n1:component[last()]/n1:section/n1:templateId/@root"/>
    <xsl:if test="$sectionID = '2.16.840.1.113883.10.20.22.2.1' or  $sectionID = '2.16.840.1.113883.10.20.22.2.1.1'">
      <xsl:call-template name="documentGeneral"/>
      <xsl:call-template name="careTeam"/>
      <xsl:call-template name="participant"/>
      <xsl:call-template name="dataEnterer"/>
      <xsl:call-template name="authenticator"/>
      <xsl:call-template name="informant"/>
      <xsl:call-template name="informationRecipient"/>
      <xsl:call-template name="legalAuthenticator"/>
      <br/>
      <div class="clearfix"></div>
      <a class="backToTop" href="#top" title="Back to Top">Back to Top</a>
    </xsl:if>
  </xsl:template>
	
	<!-- top level section title -->
	<xsl:template name="section-title-span">
		<xsl:param name="title"/>
    <xsl:param name="id"/>
		<span>
			<xsl:attribute name="class">
				<xsl:value-of select="n1:title"/>
			</xsl:attribute>
      <xsl:attribute name="ID">
				<xsl:value-of select="$id"/>
			</xsl:attribute>
		</span>
	</xsl:template>
	
	<!-- nested component/section -->
	<xsl:template name="nestedSection">
		<xsl:param name="margin"/>
		<h4 style="margin-left : {$margin}em;">
			<xsl:value-of select="n1:title"/>
		</h4>
		<div style="margin-left : {$margin}em;">
			<xsl:apply-templates select="n1:text"/>
		</div>
		<xsl:for-each select="n1:component/n1:section">
			<xsl:call-template name="nestedSection">
				<xsl:with-param name="margin" select="2*$margin"/>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>

  <!-- Check for Group_ in Id's-->
  
  <xsl:template match="//*[contains(@ID, 'GROUP_')]">
    <xsl:param name="elementName" select= "name(.)"/>
    <xsl:if test = "$elementName = 'paragraph'">
      <p style="margin:4px;clear:left;">
       <xsl:attribute name="id">
        <xsl:value-of select="@ID"/>
       </xsl:attribute>
      <xsl:apply-templates/>
     </p> 
     </xsl:if>
    
      
    <xsl:if test ="$elementName = 'table'"> 
      <table class="narr_table"> 
        <xsl:attribute name="id"> 
        <xsl:value-of select="@ID"/> 
          </xsl:attribute> 
        <xsl:call-template name="output-attrs"/> 
        <xsl:apply-templates/> 
      </table> 
    </xsl:if> 
    
      
    <xsl:if test ="$elementName = 'list'">
      <xsl:choose>
        <xsl:when test ="@listType = 'ordered'">
          <xsl:if test="n1:caption">
            <span style="font-weight:bold; ">
              <xsl:apply-templates select="n1:caption"/>
            </span>
          </xsl:if>
          <ol>
            <xsl:attribute name="id">
              <xsl:value-of select="@ID"/>
            </xsl:attribute>
            <xsl:for-each select="n1:item">
              <li>
                <xsl:apply-templates/>
              </li>
            </xsl:for-each>
          </ol>
        </xsl:when>
        <xsl:otherwise>
        <xsl:if test="n1:caption">
			    <p>
				    <b>
					    <xsl:apply-templates select="n1:caption"/>
				    </b>
			    </p>
		    </xsl:if>
		      <ul>
            <xsl:attribute name="id">
              <xsl:value-of select="@ID"/>
            </xsl:attribute>
		        	<xsl:for-each select="n1:item">
			    	<li>
					      <xsl:apply-templates/>
				    </li>
			        </xsl:for-each>
		        </ul>
      </xsl:otherwise>
      </xsl:choose>
      </xsl:if>
    </xsl:template>
  
  <!-- Check for Item_ in Id's-->
  
  <xsl:template match="//*[contains(@ID, 'ITEM_')]">
    <xsl:param name="itemName" select= "name(.)"/>
    <xsl:if test = "$itemName = 'content'">
      <span class="section_item">
        <xsl:attribute name="id">
           <xsl:value-of select="@ID"/>
        </xsl:attribute>
        
        <xsl:apply-templates/>
      </span>
    </xsl:if>

    <xsl:if test = "$itemName = 'paragraph'">
      <p style="margin:4px;">
        <xsl:attribute name="id">
          <xsl:value-of select="@ID"/>
        </xsl:attribute>
        <xsl:apply-templates/>
      </p>
    </xsl:if>
	
	<xsl:if test = "$itemName='tr'">
		<tr class="narr_tr">
      <xsl:attribute name="id">
          <xsl:value-of select="@ID"/>
        </xsl:attribute>
			<xsl:call-template name="output-attrs"/>
			<xsl:apply-templates/>
		</tr>
	</xsl:if> 
  </xsl:template>
  
	<!--   paragraph  -->
	<xsl:template match="n1:paragraph">
    <p style="margin:4px;">
      <xsl:apply-templates/>
    </p> 
	</xsl:template>
	<!--   pre format  -->
	<xsl:template match="n1:pre">
		<pre>
			<xsl:apply-templates/>
		</pre>
	</xsl:template>
	<!--   Content w/ deleted text is hidden -->
	<xsl:template match="n1:content[@revised='delete']"/>
	<!--   content  -->
	<xsl:template match="n1:content">
		<span>
      <xsl:attribute name="id">
        <xsl:value-of select="@ID"/>
      </xsl:attribute>
			<xsl:apply-templates select="@styleCode"/>
			<xsl:apply-templates/>
		</span>
	</xsl:template>
	<!-- line break -->
	<xsl:template match="n1:br">
		<xsl:element name='br'>
			<xsl:apply-templates/>
		</xsl:element>
	</xsl:template>
	<!--   list  -->
	<xsl:template match="n1:list">
		<xsl:if test="n1:caption">
			<p>
				<b>
					<xsl:apply-templates select="n1:caption"/>
				</b>
			</p>
		</xsl:if>
		<ul>
			<xsl:for-each select="n1:item">
				<li>
					<xsl:apply-templates/>
				</li>
			</xsl:for-each>
		</ul>
	</xsl:template>
	<xsl:template match="n1:list[@listType='ordered']">
		<xsl:if test="n1:caption">
			<span style="font-weight:bold; ">
				<xsl:apply-templates select="n1:caption"/>
			</span>
		</xsl:if>
		<ol>
			<xsl:for-each select="n1:item">
				<li>
					<xsl:apply-templates/>
				</li>
			</xsl:for-each>
		</ol>
	</xsl:template>
	<!--   caption  -->
	<xsl:template match="n1:caption">
		<xsl:apply-templates/>
		<xsl:text>: </xsl:text>
	</xsl:template>
	<!--  Tables   -->

    <!-- Commenting out and modifying this code for security vulnerabilites.
	<xsl:template match="n1:table/@*|n1:thead/@*|n1:tfoot/@*|n1:tbody/@*|n1:colgroup/@*|n1:col/@*|n1:tr/@*|n1:th/@*|n1:td/@*">

   
		<xsl:copy>
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates/>
		</xsl:copy>
	</xsl:template>
    -->

    <xsl:template name="output-attrs">
        <xsl:for-each select="@*">
            <xsl:variable name="attr-name" select="local-name(.)"/>
            <xsl:variable name="source" select="."/>
            <xsl:variable name="lcSource" select="translate(doc, $lc, $uc)"/>
            <xsl:variable name="scrubbedSource" select="translate($source, $simple-sanitizer-match, $simple-sanitizer-replace)"/>
            <xsl:choose>
                <xsl:when test="contains($lcSource,'javascript')">
                    <p><xsl:value-of select="$javascript-injection-warning"/></p>
                    <xsl:message terminate="yes"><xsl:value-of select="$javascript-injection-warning"/></xsl:message>
                </xsl:when>
                <xsl:when test="$attr-name='styleCode'">
                    <xsl:apply-templates select="."/>
                </xsl:when>
                <xsl:when test="not($source = $scrubbedSource)">
                    <p><xsl:value-of select="$malicious-content-warning"/> </p>
                    <xsl:message><xsl:value-of select="$malicious-content-warning"/></xsl:message>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:copy-of select="."/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:template>
	<xsl:template match="n1:table">
		<table class="narr_table">
			<xsl:call-template name="output-attrs"/>
			<xsl:apply-templates/>
		</table>
	</xsl:template>
	<xsl:template match="n1:thead">
		<thead>
			<xsl:call-template name="output-attrs"/>
			<xsl:apply-templates/>
		</thead>
	</xsl:template>
	<xsl:template match="n1:tfoot">
		<tfoot>
			<xsl:call-template name="output-attrs"/>
			<xsl:apply-templates/>
		</tfoot>
	</xsl:template>
	<xsl:template match="n1:tbody">
		<tbody>
			<xsl:call-template name="output-attrs"/>
			<xsl:apply-templates/>
		</tbody>
	</xsl:template>
	<xsl:template match="n1:colgroup">
		<colgroup>
			<xsl:call-template name="output-attrs"/>
			<xsl:apply-templates/>
		</colgroup>
	</xsl:template>
	<xsl:template match="n1:col">
		<col>
			<xsl:call-template name="output-attrs"/>
			<xsl:apply-templates/>
		</col>
	</xsl:template>
	<xsl:template match="n1:tr">
		<tr class="narr_tr">
			<xsl:call-template name="output-attrs"/>
			<xsl:apply-templates/>
		</tr>
	</xsl:template>
	<xsl:template match="n1:th">
		<th class="narr_th">
			<xsl:call-template name="output-attrs"/>
			<xsl:apply-templates/>
		</th>
	</xsl:template>
	<xsl:template match="n1:td">
		<td>
			<xsl:call-template name="output-attrs"/>
			<xsl:apply-templates/>
		</td>
	</xsl:template>
	<xsl:template match="n1:table/n1:caption">
		<caption style="font-weight:bold; text-align:left;">
			<xsl:apply-templates/>
		</caption>
	</xsl:template>
  
	<!--   RenderMultiMedia 
    this currently only handles GIF's and JPEG's.  It could, however,
    be extended by including other image MIME types in the predicate
    and/or by generating <object> or <applet> tag with the correct
    params depending on the media type  @ID  =$imageRef  referencedObject
    -->
    <!-- Commenting out the renderMultimedia part
         Right now we will not be supporting images inside our document
	 We need to eventually find a solution for this
	<xsl:template match="n1:renderMultiMedia">
		<xsl:variable name="imageRef" select="@referencedObject"/>
		<xsl:choose>
			<xsl:when test="//n1:regionOfInterest[@ID=$imageRef]">
				--><!-- Here is where the Region of Interest image referencing goes -->
			<!--	<xsl:if test="//n1:regionOfInterest[@ID=$imageRef]//n1:observationMedia/n1:value[@mediaType='image/gif'           or
          @mediaType='image/jpeg']">
					<br clear="all"/>
					<xsl:element name="img">
						<xsl:attribute name="src"><xsl:value-of select="//n1:regionOfInterest[@ID=$imageRef]//n1:observationMedia/n1:value/n1:reference/@value"/></xsl:attribute>
					</xsl:element>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				--><!-- Here is where the direct MultiMedia image referencing goes -->
				<!--<xsl:if test="//n1:observationMedia[@ID=$imageRef]/n1:value[@mediaType='image/gif' or @mediaType='image/jpeg']">
					<br clear="all"/>
					<xsl:element name="img">
						<xsl:attribute name="src"><xsl:value-of select="//n1:observationMedia[@ID=$imageRef]/n1:value/n1:reference/@value"/></xsl:attribute>
					</xsl:element>
				</xsl:if>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template> -->
	<!--    Stylecode processing   
    Supports Bold, Underline and Italics display
    -->
	<xsl:template match="@styleCode">
		<xsl:attribute name="class"><xsl:value-of select="."/></xsl:attribute>
	</xsl:template>

	<!--<xsl:template match="//n1:*[@styleCode]">
		<xsl:if test="@styleCode='Bold'">
			<xsl:element name="b">
				<xsl:apply-templates/>
			</xsl:element>
		</xsl:if>
		<xsl:if test="@styleCode='Italics'">
			<xsl:element name="i">
				<xsl:apply-templates/>
			</xsl:element>
		</xsl:if>
		<xsl:if test="@styleCode='Underline'">
			<xsl:element name="u">
				<xsl:apply-templates/>
			</xsl:element>
		</xsl:if>
		<xsl:if test="contains(@styleCode,'Bold') and contains(@styleCode,'Italics') and not (contains(@styleCode, 'Underline'))">
			<xsl:element name="b">
				<xsl:element name="i">
					<xsl:apply-templates/>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="contains(@styleCode,'Bold') and contains(@styleCode,'Underline') and not (contains(@styleCode, 'Italics'))">
			<xsl:element name="b">
				<xsl:element name="u">
					<xsl:apply-templates/>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="contains(@styleCode,'Italics') and contains(@styleCode,'Underline') and not (contains(@styleCode, 'Bold'))">
			<xsl:element name="i">
				<xsl:element name="u">
					<xsl:apply-templates/>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="contains(@styleCode,'Italics') and contains(@styleCode,'Underline') and contains(@styleCode, 'Bold')">
			<xsl:element name="b">
				<xsl:element name="i">
					<xsl:element name="u">
						<xsl:apply-templates/>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="not (contains(@styleCode,'Italics') or contains(@styleCode,'Underline') or contains(@styleCode, 'Bold'))">
			<xsl:apply-templates/>
		</xsl:if>
	</xsl:template>-->
	
	<!--    Superscript or Subscript   -->
	<xsl:template match="n1:sup">
		<xsl:element name="sup">
			<xsl:apply-templates/>
		</xsl:element>
	</xsl:template>
	<xsl:template match="n1:sub">
		<xsl:element name="sub">
			<xsl:apply-templates/>
		</xsl:element>
	</xsl:template>
	<!-- show nonXMLBody -->
        <!-- Commenting out this code as it is a potential security threat
	<xsl:template match='n1:component/n1:nonXMLBody'>
		<xsl:choose>
			--><!-- if there is a reference, use that in an IFRAME -->
			<!--<xsl:when test='n1:text/n1:reference'>
				<IFRAME name='nonXMLBody' id='nonXMLBody' WIDTH='80%' HEIGHT='66%' src='{n1:text/n1:reference/@value}'/>
			</xsl:when>
			<xsl:when test='n1:text/@mediaType="text/plain"'>
				<pre>
					<xsl:value-of select='n1:text/text()'/>
				</pre>
			</xsl:when>
			<xsl:otherwise>
				<CENTER>Cannot display the text</CENTER>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
        -->
	<!-- show-signature -->
	<xsl:template name="show-sig">
		<xsl:param name="sig"/>
		<xsl:choose>
			<xsl:when test="$sig/@code =&apos;S&apos;">
				<xsl:text>signed</xsl:text>
			</xsl:when>
			<xsl:when test="$sig/@code=&apos;I&apos;">
				<xsl:text>intended</xsl:text>
			</xsl:when>
			<xsl:when test="$sig/@code=&apos;X&apos;">
				<xsl:text>signature required</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<!--	show-id	-->
	<xsl:template name="show-id">
		<xsl:param name="id"/>
		<xsl:choose>
			<xsl:when test="not($id)">
				<xsl:if test="not(@nullFlavor)">
					<xsl:if test="@extension">
						<xsl:value-of select="@extension"/>
					</xsl:if>
<!--					<xsl:text> </xsl:text>-->
<!--					<xsl:value-of select="@root"/>-->
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:if test="not($id/@nullFlavor)">
					<xsl:if test="$id/@extension">
						<xsl:value-of select="$id/@extension"/>
					</xsl:if>
<!--					<xsl:text> </xsl:text>-->
<!--					<xsl:value-of select="$id/@root"/>-->
				</xsl:if>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- show-name	-->
	<xsl:template name="show-name">
		<xsl:param name="name"/>
		<xsl:choose>
			<xsl:when test="$name/n1:family">
				<xsl:if test="$name/n1:prefix">
					<xsl:value-of select="$name/n1:prefix"/>
					<xsl:text> </xsl:text>
				</xsl:if>
				<xsl:value-of select="$name/n1:given"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="$name/n1:family"/>
				<xsl:if test="$name/n1:suffix">
					<xsl:text>, </xsl:text>
					<xsl:value-of select="$name/n1:suffix"/>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$name"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- show-sex	-->
	<xsl:template name="show-sex">
		<xsl:choose>
			<xsl:when test="@code   = &apos;M&apos;">
				<xsl:text>Male</xsl:text>
			</xsl:when>
			<xsl:when test="@code  = &apos;F&apos;">
				<xsl:text>Female</xsl:text>
			</xsl:when>
			<xsl:when test="@code  = &apos;U&apos;">
				<xsl:text>Undifferentiated</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
       <!-- show-race-ethnicity  -->
   <xsl:template name="show-race-ethnicity">
      <xsl:choose>
         <xsl:when test="@displayName">
            <xsl:value-of select="@displayName"/>
         </xsl:when>
         <xsl:otherwise>
            <xsl:value-of select="@code"/>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
          <!-- show-race-ethnicity-list  -->
   <xsl:template name="show-race-ethnicity-list">
      <xsl:choose>
         <xsl:when test="@displayName">
            <xsl:value-of select="concat(', ', @displayName)"/>
         </xsl:when>
         <xsl:otherwise>
            <xsl:value-of select="concat(', ', @code)"/>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <!-- show-preferred-language  -->
   <xsl:template name="show-preferred-language">
      <xsl:choose>
         <xsl:when test="@displayName">
            <xsl:value-of select="@displayName"/>
         </xsl:when>
         <xsl:otherwise>
            <xsl:value-of select="@code"/>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
	<!-- getCombinedCareTeam - This returns a combined list of persons found in the documentationOf and componentOf sections. -->
	<xsl:template name="getCombinedCareTeam">
		<xsl:if test="/n1:ClinicalDocument/n1:documentationOf">
			<xsl:for-each select="/n1:ClinicalDocument/n1:documentationOf/n1:serviceEvent/n1:performer">
				<xsl:call-template name="BuildCareTeamEntry">
					<xsl:with-param name="asgnEntity" select="n1:assignedEntity"/>
				</xsl:call-template>
			</xsl:for-each>
		</xsl:if>
		<xsl:if test="/n1:ClinicalDocument/n1:componentOf">
			<xsl:for-each select="/n1:ClinicalDocument/n1:componentOf/n1:encompassingEncounter/n1:encounterParticipant">
				<xsl:call-template name="BuildCareTeamEntry">
					<xsl:with-param name="asgnEntity" select="n1:assignedEntity"/>
				</xsl:call-template>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
	<!-- BuildCareTeamEntry - Builds a temporary structure for a provider containing name, phone number(s), and address(es). -->
	<xsl:template name="BuildCareTeamEntry">
		<xsl:param name="asgnEntity"/>
		<person>
			<name>
				<xsl:call-template name="show-assignedEntity">
					<xsl:with-param name="asgnEntity" select="$asgnEntity"/>
				</xsl:call-template>
			</name>
			<xsl:if test="$asgnEntity/n1:telecom and not($asgnEntity/n1:telecom/@nullFlavor)">
				<xsl:for-each select="$asgnEntity/n1:telecom">
					<telcom>
						<xsl:call-template name="show-telecom">
							<xsl:with-param name="telecom" select="."/>
							<xsl:with-param name="showUse" select="false()"/>
						</xsl:call-template>
					</telcom>
				</xsl:for-each>
			</xsl:if>
			<xsl:if test="$asgnEntity/n1:addr and not($asgnEntity/n1:addr/@nullFlavor)">
				<xsl:for-each select="$asgnEntity/n1:addr">
					<addr>
						<xsl:attribute name="use">
							<xsl:value-of select="./@use"/>
						</xsl:attribute>
						<xsl:for-each select="./n1:streetAddressLine">
							<streetAddressLine>
								<xsl:value-of select="."/>
							</streetAddressLine>
						</xsl:for-each>
						<city>
							<xsl:value-of select="./n1:city"/>
						</city>
						<state>
							<xsl:value-of select="./n1:state"/>
						</state>
						<postalCode>
							<xsl:value-of select="./n1:postalCode"/>
						</postalCode>
						<country>
							<xsl:value-of select="./n1:country"/>
						</country>
					</addr>
				</xsl:for-each>
			</xsl:if>
		</person>
	</xsl:template>
	<!-- show-contactInfo -->
	<xsl:template name="show-contactInfo">
		<xsl:param name="contact"/>
		<xsl:param name="showUse"/>
		<xsl:call-template name="show-address">
			<xsl:with-param name="address" select="$contact/n1:addr"/>
			<xsl:with-param name="showUse" select="$showUse"/>
		</xsl:call-template>
		<xsl:call-template name="show-telecom">
			<xsl:with-param name="telecom" select="$contact/n1:telecom"/>
			<xsl:with-param name="showUse" select="$showUse"/>
		</xsl:call-template>
		<br/>
	</xsl:template>
	<!-- show-address - NOTE: This will only show ONE address, if you expect multiple, call this function in a loop -->
	<xsl:template name="show-address">
		<xsl:param name="address"/>
		<xsl:param name="showUse"/>
		<xsl:choose>
			<xsl:when test="$address">
				<xsl:if test="$address/@use and $showUse">
					<xsl:text> </xsl:text>
					<xsl:call-template name="translateTelecomCode">
						<xsl:with-param name="code" select="$address/@use"/>
					</xsl:call-template>
					<xsl:text>:</xsl:text>
					<br/>
				</xsl:if>
				<xsl:for-each select="$address[1]/n1:streetAddressLine">
					<xsl:value-of select="."/>
					<br/>
				</xsl:for-each>
				<xsl:if test="$address/n1:streetName">
					<xsl:value-of select="$address/n1:streetName"/>
					<xsl:text> </xsl:text>
					<xsl:value-of select="$address/n1:houseNumber"/>
					<br/>
				</xsl:if>
				<xsl:if test="string-length($address/n1:city)>0">
					<xsl:value-of select="$address/n1:city"/>
				</xsl:if>
				<xsl:if test="string-length($address/n1:state)>0">
					<xsl:text>,&#160;</xsl:text>
					<xsl:value-of select="$address/n1:state"/>
				</xsl:if>
				<xsl:if test="string-length($address/n1:postalCode)>0">
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of select="$address/n1:postalCode"/>
				</xsl:if>
				<xsl:if test="string-length($address/n1:country)>0">
					<xsl:text>,&#160;</xsl:text>
					<xsl:value-of select="$address/n1:country"/>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>address not available</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<br/>
	</xsl:template>
	<!-- show-temp-address - This shows the address in a temporary structure, not the one from the main xml. NOTE: This will only show ONE address, if you expect multiple, call this function in a loop -->
	<xsl:template name="show-temp-address">
		<xsl:param name="address"/>
		<xsl:param name="showUse"/>
		<xsl:choose>
			<xsl:when test="$address">
				<xsl:if test="$address/@use and $showUse">
					<xsl:text> </xsl:text>
					<xsl:call-template name="translateTelecomCode">
						<xsl:with-param name="code" select="$address/@use"/>
					</xsl:call-template>
					<xsl:text>:</xsl:text>
					<br/>
				</xsl:if>
				<xsl:for-each select="$address[1]/streetAddressLine">
					<xsl:value-of select="."/>
					<br/>
				</xsl:for-each>
				<xsl:if test="$address/streetName">
					<xsl:value-of select="$address/streetName"/>
					<xsl:text> </xsl:text>
					<xsl:value-of select="$address/houseNumber"/>
					<br/>
				</xsl:if>
				<xsl:if test="string-length($address/city)>0">
					<xsl:value-of select="$address/city"/>
				</xsl:if>
				<xsl:if test="string-length($address/state)>0">
					<xsl:text>,&#160;</xsl:text>
					<xsl:value-of select="$address/state"/>
				</xsl:if>
				<xsl:if test="string-length($address/postalCode)>0">
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of select="$address/postalCode"/>
				</xsl:if>
				<xsl:if test="string-length($address/country)>0">
					<xsl:text>,&#160;</xsl:text>
					<xsl:value-of select="$address/country"/>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>address not available</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- show-telecom -->
	<xsl:template name="show-telecom">
		<xsl:param name="telecom"/>
		<xsl:param name="showUse"/>
		<xsl:choose>
			<xsl:when test="$telecom">
				<xsl:variable name="type" select="substring-before($telecom/@value, ':')"/>
				<xsl:variable name="value" select="substring-after($telecom/@value, ':')"/>
				<xsl:if test="$type">
					<xsl:if test="$telecom/@use and $showUse">
						<xsl:call-template name="translateTelecomCode">
							<xsl:with-param name="code" select="$telecom/@use"/>
						</xsl:call-template>
						<xsl:text> </xsl:text>
					</xsl:if>
					<xsl:call-template name="translateTelecomCode">
						<xsl:with-param name="code" select="$type"/>
					</xsl:call-template>
					<xsl:text>: </xsl:text>
					<xsl:text> </xsl:text>
					<xsl:value-of select="$value"/>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>Telecom information not available</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- show-recipientType -->
	<xsl:template name="show-recipientType">
		<xsl:param name="typeCode"/>
		<xsl:choose>
			<xsl:when test="$typeCode='PRCP'">Primary Recipient:</xsl:when>
			<xsl:when test="$typeCode='TRC'">Secondary Recipient:</xsl:when>
			<xsl:otherwise>Recipient:</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- Convert Telecom URL to display text -->
	<xsl:template name="translateTelecomCode">
		<xsl:param name="code"/>
		<!--xsl:value-of select="document('voc.xml')/systems/system[@root=$code/@codeSystem]/code[@value=$code/@code]/@displayName"/-->
		<!--xsl:value-of select="document('codes.xml')/*/code[@code=$code]/@display"/-->
		<xsl:choose>
			<!-- lookup table Telecom URI -->
			<xsl:when test="$code='tel'">
				<xsl:text>Tel</xsl:text>
			</xsl:when>
			<xsl:when test="$code='fax'">
				<xsl:text>Fax</xsl:text>
			</xsl:when>
			<xsl:when test="$code='http'">
				<xsl:text>Web</xsl:text>
			</xsl:when>
			<xsl:when test="$code='mailto'">
				<xsl:text>Mail</xsl:text>
			</xsl:when>
			<xsl:when test="$code='H'">
				<xsl:text>Home</xsl:text>
			</xsl:when>
			<xsl:when test="$code='HV'">
				<xsl:text>Vacation Home</xsl:text>
			</xsl:when>
			<xsl:when test="$code='HP'">
				<xsl:text>Primary Home</xsl:text>
			</xsl:when>
			<xsl:when test="$code='WP'">
				<xsl:text>Work</xsl:text>
			</xsl:when>
			<xsl:when test="$code='DIR'">
				<xsl:text>Dir</xsl:text>
			</xsl:when>
			<xsl:when test="$code='PUB'">
				<xsl:text>Pub</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>{$code='</xsl:text>
				<xsl:value-of select="$code"/>
				<xsl:text>'?}</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- convert RoleClassAssociative code to display text -->
	<xsl:template name="translateRoleAssoCode">
		<xsl:param name="code"/>
		<xsl:choose>
			<xsl:when test="$code='AFFL'">
				<xsl:text>affiliate</xsl:text>
			</xsl:when>
			<xsl:when test="$code='AGNT'">
				<xsl:text>agent</xsl:text>
			</xsl:when>
			<xsl:when test="$code='ASSIGNED'">
				<xsl:text>assigned entity</xsl:text>
			</xsl:when>
			<xsl:when test="$code='COMPAR'">
				<xsl:text>commissioning party</xsl:text>
			</xsl:when>
			<xsl:when test="$code='CON'">
				<xsl:text>contact</xsl:text>
			</xsl:when>
			<xsl:when test="$code='ECON'">
				<xsl:text>emergency contact</xsl:text>
			</xsl:when>
			<xsl:when test="$code='NOK'">
				<xsl:text>next of kin</xsl:text>
			</xsl:when>
			<xsl:when test="$code='SGNOFF'">
				<xsl:text>signing authority</xsl:text>
			</xsl:when>
			<xsl:when test="$code='GUARD'">
				<xsl:text>guardian</xsl:text>
			</xsl:when>
			<xsl:when test="$code='GUAR'">
				<xsl:text>guardian</xsl:text>
			</xsl:when>
			<xsl:when test="$code='CIT'">
				<xsl:text>citizen</xsl:text>
			</xsl:when>
			<xsl:when test="$code='COVPTY'">
				<xsl:text>covered party</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>{$code='</xsl:text>
				<xsl:value-of select="$code"/>
				<xsl:text>'?}</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- show time -->
	<xsl:template name="show-time">
		<xsl:param name="datetime"/>
		<xsl:choose>
			<xsl:when test="not($datetime)">
				<xsl:call-template name="formatDateTime">
					<xsl:with-param name="date" select="@value"/>
				</xsl:call-template>
				<xsl:text> </xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="formatDateTime">
					<xsl:with-param name="date" select="$datetime/@value"/>
				</xsl:call-template>
				<xsl:text> </xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- show assignedEntity -->
	<xsl:template name="show-assignedEntity">
		<xsl:param name="asgnEntity"/>
		<xsl:choose>
			<xsl:when test="$asgnEntity/n1:assignedPerson/n1:name">
				<xsl:call-template name="show-name">
					<xsl:with-param name="name" select="$asgnEntity/n1:assignedPerson/n1:name"/>
				</xsl:call-template>
				<xsl:if test="$asgnEntity/n1:representedOrganization/n1:name">
					<xsl:text> of </xsl:text>
					<xsl:value-of select="$asgnEntity/n1:representedOrganization/n1:name"/>
				</xsl:if>
			</xsl:when>
			<xsl:when test="$asgnEntity/n1:representedOrganization">
				<xsl:value-of select="$asgnEntity/n1:representedOrganization/n1:name"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="$asgnEntity/n1:id">
					<xsl:call-template name="show-id"/>
					<xsl:choose>
						<xsl:when test="position()!=last()">
							<xsl:text>, </xsl:text>
						</xsl:when>
						<xsl:otherwise>
							<br/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- show relatedEntity -->
	<xsl:template name="show-relatedEntity">
		<xsl:param name="relatedEntity"/>
		<xsl:choose>
			<xsl:when test="$relatedEntity/n1:relatedPerson/n1:name">
				<xsl:call-template name="show-name">
					<xsl:with-param name="name" select="$relatedEntity/n1:relatedPerson/n1:name"/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<!-- show associatedEntity -->
	<xsl:template name="show-associatedEntity">
		<xsl:param name="assoEntity"/>
		<xsl:choose>
			<xsl:when test="$assoEntity/n1:associatedPerson">
				<xsl:for-each select="$assoEntity/n1:associatedPerson/n1:name">
					<xsl:call-template name="show-name">
						<xsl:with-param name="name" select="."/>
					</xsl:call-template>
					<br/>
				</xsl:for-each>
			</xsl:when>
			<xsl:when test="$assoEntity/n1:scopingOrganization">
				<xsl:for-each select="$assoEntity/n1:scopingOrganization">
					<xsl:if test="n1:name">
						<xsl:call-template name="show-name">
							<xsl:with-param name="name" select="n1:name"/>
						</xsl:call-template>
						<br/>
					</xsl:if>
					<xsl:if test="n1:standardIndustryClassCode">
						<xsl:value-of select="n1:standardIndustryClassCode/@displayName"/>
						<xsl:text> code:</xsl:text>
						<xsl:value-of select="n1:standardIndustryClassCode/@code"/>
					</xsl:if>
				</xsl:for-each>
			</xsl:when>
			<xsl:when test="$assoEntity/n1:code">
				<xsl:call-template name="show-code">
					<xsl:with-param name="code" select="$assoEntity/n1:code"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$assoEntity/n1:id">
				<xsl:value-of select="$assoEntity/n1:id/@extension"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="$assoEntity/n1:id/@root"/>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<!-- show code 
		if originalText present, return it, otherwise, check and return attribute: display name
    -->
	<xsl:template name="show-code">
		<xsl:param name="code"/>
		<xsl:variable name="this-codeSystem">
			<xsl:value-of select="$code/@codeSystem"/>
		</xsl:variable>
		<xsl:variable name="this-code">
			<xsl:value-of select="$code/@code"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$code/n1:originalText">
				<xsl:value-of select="$code/n1:originalText"/>
			</xsl:when>
			<xsl:when test="$code/@displayName">
				<xsl:value-of select="$code/@displayName"/>
			</xsl:when>
			<!--
			<xsl:when test="$the-valuesets/*/voc:system[@root=$this-codeSystem]/voc:code[@value=$this-code]/@displayName">
				<xsl:value-of select="$the-valuesets/*/voc:system[@root=$this-codeSystem]/voc:code[@value=$this-code]/@displayName"/>
			</xsl:when>
			-->
			<xsl:otherwise>
				<xsl:value-of select="$this-code"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- show classCode -->
	<xsl:template name="show-actClassCode">
		<xsl:param name="clsCode"/>
		<xsl:choose>
			<xsl:when test=" $clsCode = 'ACT' ">
				<xsl:text>healthcare service</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'ACCM' ">
				<xsl:text>accommodation</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'ACCT' ">
				<xsl:text>account</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'ACSN' ">
				<xsl:text>accession</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'ADJUD' ">
				<xsl:text>financial adjudication</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'CONS' ">
				<xsl:text>consent</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'CONTREG' ">
				<xsl:text>container registration</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'CTTEVENT' ">
				<xsl:text>clinical trial timepoint event</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'DISPACT' ">
				<xsl:text>disciplinary action</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'ENC' ">
				<xsl:text>encounter</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'INC' ">
				<xsl:text>incident</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'INFRM' ">
				<xsl:text>inform</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'INVE' ">
				<xsl:text>invoice element</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'LIST' ">
				<xsl:text>working list</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'MPROT' ">
				<xsl:text>monitoring program</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'PCPR' ">
				<xsl:text>care provision</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'PROC' ">
				<xsl:text>procedure</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'REG' ">
				<xsl:text>registration</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'REV' ">
				<xsl:text>review</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'SBADM' ">
				<xsl:text>substance administration</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'SPCTRT' ">
				<xsl:text>speciment treatment</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'SUBST' ">
				<xsl:text>substitution</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'TRNS' ">
				<xsl:text>transportation</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'VERIF' ">
				<xsl:text>verification</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'XACT' ">
				<xsl:text>financial transaction</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<!-- show participationType -->
	<xsl:template name="show-participationType">
		<xsl:param name="ptype"/>
		<xsl:choose>
			<xsl:when test=" $ptype='PPRF' ">
				<xsl:text>primary performer</xsl:text>
			</xsl:when>
			<xsl:when test=" $ptype='PRF' ">
				<xsl:text>performer</xsl:text>
			</xsl:when>
			<xsl:when test=" $ptype='VRF' ">
				<xsl:text>verifier</xsl:text>
			</xsl:when>
			<xsl:when test=" $ptype='SPRF' ">
				<xsl:text>secondary performer</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<!-- show participationFunction -->
	<xsl:template name="show-participationFunction">
		<xsl:param name="pFunction"/>
		<xsl:choose>
			<xsl:when test=" $pFunction = 'ADMPHYS' ">
				<xsl:text>admitting physician</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'ANEST' ">
				<xsl:text>anesthesist</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'ANRS' ">
				<xsl:text>anesthesia nurse</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'ATTPHYS' ">
				<xsl:text>attending physician</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'DISPHYS' ">
				<xsl:text>discharging physician</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'FASST' ">
				<xsl:text>first assistant surgeon</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'MDWF' ">
				<xsl:text>midwife</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'NASST' ">
				<xsl:text>nurse assistant</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'PCP' ">
				<xsl:text>primary care physician</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'PRISURG' ">
				<xsl:text>primary surgeon</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'RNDPHYS' ">
				<xsl:text>rounding physician</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'SASST' ">
				<xsl:text>second assistant surgeon</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'SNRS' ">
				<xsl:text>scrub nurse</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'TASST' ">
				<xsl:text>third assistant</xsl:text>
			</xsl:when>
         <xsl:when test=" $pFunction = 'PP' ">
            <xsl:text>Primary Care Provider</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'RP' ">
            <xsl:text>Referring Provider</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'CP' ">
            <xsl:text>Consulting Provider</xsl:text>
         </xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="formatDateTime">
		<xsl:param name="date"/>
		<!-- month -->
		<xsl:variable name="month" select="substring ($date, 5, 2)"/>
		<xsl:choose>
			<xsl:when test="$month='01'">
				<xsl:text>January </xsl:text>
			</xsl:when>
			<xsl:when test="$month='02'">
				<xsl:text>February </xsl:text>
			</xsl:when>
			<xsl:when test="$month='03'">
				<xsl:text>March </xsl:text>
			</xsl:when>
			<xsl:when test="$month='04'">
				<xsl:text>April </xsl:text>
			</xsl:when>
			<xsl:when test="$month='05'">
				<xsl:text>May </xsl:text>
			</xsl:when>
			<xsl:when test="$month='06'">
				<xsl:text>June </xsl:text>
			</xsl:when>
			<xsl:when test="$month='07'">
				<xsl:text>July </xsl:text>
			</xsl:when>
			<xsl:when test="$month='08'">
				<xsl:text>August </xsl:text>
			</xsl:when>
			<xsl:when test="$month='09'">
				<xsl:text>September </xsl:text>
			</xsl:when>
			<xsl:when test="$month='10'">
				<xsl:text>October </xsl:text>
			</xsl:when>
			<xsl:when test="$month='11'">
				<xsl:text>November </xsl:text>
			</xsl:when>
			<xsl:when test="$month='12'">
				<xsl:text>December </xsl:text>
			</xsl:when>
		</xsl:choose>
		<!-- day -->
		<xsl:choose>
			<xsl:when test='substring ($date, 7, 1)="0"'>
				<xsl:value-of select="substring ($date, 8, 1)"/>
				<xsl:text>, </xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="substring ($date, 7, 2)"/>
				<xsl:text>, </xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<!-- year -->
		<xsl:value-of select="substring ($date, 1, 4)"/>
		<!-- time and US timezone -->
    <!--
		<xsl:if test="string-length($date) > 8">
			<xsl:text>, </xsl:text>
      -->
			<!-- time -->
    <!--
			<xsl:variable name="time">
				<xsl:value-of select="substring($date,9,6)"/>
			</xsl:variable>
			<xsl:variable name="hh">
				<xsl:value-of select="substring($time,1,2)"/>
			</xsl:variable>
			<xsl:variable name="mm">
				<xsl:value-of select="substring($time,3,2)"/>
			</xsl:variable>
			<xsl:variable name="ss">
				<xsl:value-of select="substring($time,5,2)"/>
			</xsl:variable>
			<xsl:if test="string-length($hh)&gt;1">
 
				<xsl:value-of select="$hh"/>
				<xsl:if test="string-length($mm)&gt;1 and not(contains($mm,'-')) and not (contains($mm,'+'))">
					<xsl:text>:</xsl:text>
					<xsl:value-of select="$mm"/>
					<xsl:if test="string-length($ss)&gt;1 and not(contains($ss,'-')) and not (contains($ss,'+'))">
						<xsl:text>:</xsl:text>
						<xsl:value-of select="$ss"/>
					</xsl:if>
				</xsl:if>
       
			</xsl:if> -->
			<!-- time zone -->
    <!--
			<xsl:variable name="tzon">
				<xsl:choose>
					<xsl:when test="contains($date,'+')">
						<xsl:text>+</xsl:text>
						<xsl:value-of select="substring-after($date, '+')"/>
					</xsl:when>
					<xsl:when test="contains($date,'-')">
						<xsl:text>-</xsl:text>
						<xsl:value-of select="substring-after($date, '-')"/>
					</xsl:when>
				</xsl:choose>
			</xsl:variable>
			<xsl:choose> -->
				<!-- reference: http://www.timeanddate.com/library/abbreviations/timezones/na/ -->
    <!--
				<xsl:when test="$tzon = '-0500' "> 
					<xsl:text>--><!--, EST--><!--</xsl:text> -->
		<!--		</xsl:when>
				<xsl:when test="$tzon = '-0600' ">
					<xsl:text>--><!--, CST--><!--</xsl:text>
				</xsl:when>
				<xsl:when test="$tzon = '-0700' ">
					<xsl:text>--><!--, MST--><!--</xsl:text>
				</xsl:when>
				<xsl:when test="$tzon = '-0800' ">
					<xsl:text>--><!--, PST--><!--</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text> </xsl:text>
					<xsl:value-of select="$tzon"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
    -->
	</xsl:template>
	<!-- convert to lower case -->
	<xsl:template name="caseDown">
		<xsl:param name="data"/>
		<xsl:if test="$data">
			<xsl:value-of select="translate($data, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')"/>
		</xsl:if>
	</xsl:template>
	<!-- convert to upper case -->
	<xsl:template name="caseUp">
		<xsl:param name="data"/>
		<xsl:if test="$data">
			<xsl:value-of select="translate($data,'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')"/>
		</xsl:if>
	</xsl:template>
	<!-- convert first character to upper case -->
	<xsl:template name="firstCharCaseUp">
		<xsl:param name="data"/>
		<xsl:if test="$data">
			<xsl:call-template name="caseUp">
				<xsl:with-param name="data" select="substring($data,1,1)"/>
			</xsl:call-template>
			<xsl:value-of select="substring($data,2)"/>
		</xsl:if>
	</xsl:template>
	<!-- show-noneFlavor -->
	<!-- to do list -->
	<xsl:template name="show-noneFlavor">   
	</xsl:template>

  <xsl:template name="documentGeneral">
    <!--  <hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/> -->
    <div class="section_title">
      <a href="#">Details</a>
    </div>

    <!--			<tr>
					<td>
						<span class="td_label">
							<xsl:text>Document Id</xsl:text>
						</span>
					</td>
					<td>
                  <xsl:value-of select="n1:id/@root"/>
						<xsl:call-template name="show-id">
							<xsl:with-param name="id" select="n1:id"/>
						</xsl:call-template>
					</td>
				</tr>-->
    <div style="float:left;">
      <div style="margin-bottom:20px;">
        <span class="td_label">
          <xsl:text>Document Created</xsl:text>
        </span>
        <br />
        <xsl:call-template name="show-time">
          <xsl:with-param name="datetime" select="/n1:ClinicalDocument/n1:effectiveTime"/>
        </xsl:call-template>
      </div>

      <xsl:if test="/n1:ClinicalDocument/n1:componentOf">
        <!--     <hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/> -->

        <xsl:for-each select="/n1:ClinicalDocument/n1:componentOf/n1:encompassingEncounter">
          <div style="margin-bottom:20px;">
            <span class="td_label">
              <xsl:text>Encounter Date</xsl:text>
            </span>
            <br />
            <xsl:if test="n1:effectiveTime">
              <xsl:choose>
                <xsl:when test="n1:effectiveTime/@value">
                  <xsl:text>&#160;at&#160;</xsl:text>
                  <xsl:call-template name="show-time">
                    <xsl:with-param name="datetime" select="n1:effectiveTime"/>
                  </xsl:call-template>
                </xsl:when>
                <xsl:when test="n1:effectiveTime/n1:low">
                  <xsl:text>From&#160;</xsl:text>
                  <xsl:call-template name="show-time">
                    <xsl:with-param name="datetime" select="n1:effectiveTime/n1:low"/>
                  </xsl:call-template>
                  <xsl:if test="n1:effectiveTime/n1:high/@value">
                    <xsl:text> to </xsl:text>
                    <xsl:call-template name="show-time">
                      <xsl:with-param name="datetime" select="n1:effectiveTime/n1:high"/>
                    </xsl:call-template>
                  </xsl:if>
                </xsl:when>
              </xsl:choose>
            </xsl:if>
          </div>

          <xsl:if test="/n1:ClinicalDocument/n1:location/n1:healthCareFacility">

            <span class="td_label">
              <xsl:text>Encounter Location</xsl:text>
            </span>

            <xsl:choose>
              <xsl:when test="/n1:ClinicalDocument/n1:location/n1:healthCareFacility/n1:location/n1:name">
                <xsl:call-template name="show-name">
                  <xsl:with-param name="name" select="/n1:ClinicalDocument/n1:location/n1:healthCareFacility/n1:location/n1:name"/>
                </xsl:call-template>
                <xsl:for-each select="/n1:ClinicalDocument/n1:location/n1:healthCareFacility/n1:serviceProviderOrganization/n1:name">
                  <xsl:text> of </xsl:text>
                  <xsl:call-template name="show-name">
                    <xsl:with-param name="name" select="/n1:ClinicalDocument/n1:location/n1:healthCareFacility/n1:serviceProviderOrganization/n1:name"/>
                  </xsl:call-template>
                </xsl:for-each>
              </xsl:when>
              <xsl:when test="/n1:ClinicalDocument/n1:location/n1:healthCareFacility/n1:code">
                <xsl:call-template name="show-code">
                  <xsl:with-param name="code" select="/n1:ClinicalDocument/n1:location/n1:healthCareFacility/n1:code"/>
                </xsl:call-template>
              </xsl:when>
              <xsl:otherwise>
                <xsl:if test="/n1:ClinicalDocument/n1:location/n1:healthCareFacility/n1:id">
                  <xsl:text>id: </xsl:text>
                  <xsl:for-each select="/n1:ClinicalDocument/n1:location/n1:healthCareFacility/n1:id">
                    <xsl:call-template name="show-id">
                      <xsl:with-param name="id" select="."/>
                    </xsl:call-template>
                  </xsl:for-each>
                </xsl:if>
              </xsl:otherwise>
            </xsl:choose>

          </xsl:if>
          <xsl:if test="/n1:ClinicalDocument/n1:responsibleParty">

            <span class="td_label">
              <xsl:text>Responsible party</xsl:text>
            </span>

            <xsl:call-template name="show-assignedEntity">
              <xsl:with-param name="asgnEntity" select="/n1:ClinicalDocument/n1:responsibleParty/n1:assignedEntity"/>
            </xsl:call-template>

          </xsl:if>
          <xsl:if test="/n1:ClinicalDocument/n1:responsibleParty/n1:assignedEntity/n1:addr | /n1:ClinicalDocument/n1:responsibleParty/n1:assignedEntity/n1:telecom">

            <span class="td_label">
              <xsl:text>Contact info</xsl:text>
            </span>

            <xsl:call-template name="show-contactInfo">
              <xsl:with-param name="contact" select="/n1:ClinicalDocument/n1:responsibleParty/n1:assignedEntity"/>
              <xsl:with-param name="showUse" select="false()"/>
            </xsl:call-template>

          </xsl:if>
        </xsl:for-each>

      </xsl:if>
    </div>
  </xsl:template>
  <!-- confidentiality -->
  <xsl:template name="confidentiality">
    <!--  <hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/> -->
    <table class="header_table">
      <tbody>
        <td>
          <xsl:text>Confidentiality</xsl:text>
        </td>
        <td>
          <xsl:choose>
            <xsl:when test="/n1:ClinicalDocument/n1:confidentialityCode/@code  = &apos;N&apos;">
              <xsl:text>Normal</xsl:text>
            </xsl:when>
            <xsl:when test="/n1:ClinicalDocument/n1:confidentialityCode/@code  = &apos;R&apos;">
              <xsl:text>Restricted</xsl:text>
            </xsl:when>
            <xsl:when test="/n1:ClinicalDocument/n1:confidentialityCode/@code  = &apos;V&apos;">
              <xsl:text>Very restricted</xsl:text>
            </xsl:when>
          </xsl:choose>
          <xsl:if test="/n1:ClinicalDocument/n1:confidentialityCode/n1:originalText">
            <xsl:text> </xsl:text>
            <xsl:value-of select="/n1:ClinicalDocument/n1:confidentialityCode/n1:originalText"/>
          </xsl:if>
        </td>
      </tbody>
    </table>
  </xsl:template>
  <!-- author -->
  <!--<xsl:template name="author">
		<xsl:if test="n1:author">
 
			<table class="header_table">
				<tbody>
					<xsl:for-each select="n1:author/n1:assignedAuthor">
						<tr>
							<td>
								<span class="td_label">
									<xsl:text>Author</xsl:text>
								</span>
							</td>
							<td>
								<xsl:choose>
									<xsl:when test="n1:assignedPerson/n1:name">
										<xsl:call-template name="show-name">
											<xsl:with-param name="name" select="n1:assignedPerson/n1:name"/>
										</xsl:call-template>
										<xsl:if test="n1:representedOrganization">
											<xsl:text>, </xsl:text>
											<xsl:call-template name="show-name">
												<xsl:with-param name="name" select="n1:representedOrganization/n1:name"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:when>
									<xsl:when test="n1:assignedAuthoringDevice/n1:softwareName">
										<xsl:value-of select="n1:assignedAuthoringDevice/n1:softwareName"/>
									</xsl:when>
									<xsl:when test="n1:representedOrganization">
										<xsl:call-template name="show-name">
											<xsl:with-param name="name" select="n1:representedOrganization/n1:name"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:for-each select="n1:id">
											<xsl:call-template name="show-id"/>
											<br/>
										</xsl:for-each>
									</xsl:otherwise>
								</xsl:choose>
							</td>
						</tr>
						<xsl:if test="n1:addr | n1:telecom">
							<tr>
								<td >
									<span class="td_label">
										<xsl:text>Contact info</xsl:text>
									</span>
								</td>
								<td>
									<xsl:call-template name="show-contactInfo">
										<xsl:with-param name="contact" select="."/>
										<xsl:with-param name="showUse" select="false()"/>
									</xsl:call-template>
								</td>
							</tr>
						</xsl:if>
					</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>-->
  <!-- 	authenticator -->
  <xsl:template name="authenticator">
    <xsl:if test="/n1:ClinicalDocument/n1:authenticator">
      <!--    <hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/> -->
      <table class="header_table">
        <tbody>
          <tr>
            <xsl:for-each select="/n1:ClinicalDocument/n1:authenticator">
              <tr>
                <td>
                  <span class="td_label">
                    <xsl:text>Signed </xsl:text>
                  </span>
                </td>
                <td>
                  <xsl:call-template name="show-name">
                    <xsl:with-param name="name" select="/n1:ClinicalDocument/n1:assignedEntity/n1:assignedPerson/n1:name"/>
                  </xsl:call-template>
                  <xsl:text> at </xsl:text>
                  <xsl:call-template name="show-time">
                    <xsl:with-param name="datetime" select="n1:time"/>
                  </xsl:call-template>
                </td>
              </tr>
              <xsl:if test="/n1:ClinicalDocument/n1:assignedEntity/n1:addr | /n1:ClinicalDocument/n1:assignedEntity/n1:telecom">
                <tr>
                  <td >
                    <span class="td_label">
                      <xsl:text>Contact info</xsl:text>
                    </span>
                  </td>
                  <td>
                    <xsl:call-template name="show-contactInfo">
                      <xsl:with-param name="contact" select="/n1:ClinicalDocument/n1:assignedEntity"/>
                      <xsl:with-param name="showUse" select="false()"/>
                    </xsl:call-template>
                  </td>
                </tr>
              </xsl:if>
            </xsl:for-each>
          </tr>
        </tbody>
      </table>
    </xsl:if>
  </xsl:template>
  <!-- legalAuthenticator -->
  <xsl:template name="legalAuthenticator">
    <xsl:if test="/n1:ClinicalDocument/n1:legalAuthenticator">
      <!--    <hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/> -->
      <table class="header_table">
        <tbody>
          <tr>
            <td>
              <span class="td_label">
                <xsl:text>Legal authenticator</xsl:text>
              </span>
            </td>
            <td>
              <xsl:call-template name="show-assignedEntity">
                <xsl:with-param name="asgnEntity" select="/n1:ClinicalDocument/n1:legalAuthenticator/n1:assignedEntity"/>
              </xsl:call-template>
              <xsl:text> </xsl:text>
              <xsl:call-template name="show-sig">
                <xsl:with-param name="sig" select="/n1:ClinicalDocument/n1:legalAuthenticator/n1:signatureCode"/>
              </xsl:call-template>
              <xsl:if test="/n1:ClinicalDocument/n1:legalAuthenticator/n1:time/@value">
                <xsl:text> at </xsl:text>
                <xsl:call-template name="show-time">
                  <xsl:with-param name="datetime" select="/n1:ClinicalDocument/n1:legalAuthenticator/n1:time"/>
                </xsl:call-template>
              </xsl:if>
            </td>
          </tr>
          <xsl:if test="/n1:ClinicalDocument/n1:legalAuthenticator/n1:assignedEntity/n1:addr | /n1:ClinicalDocument/n1:legalAuthenticator/n1:assignedEntity/n1:telecom">
            <tr>
              <td >
                <span class="td_label">
                  <xsl:text>Contact info</xsl:text>
                </span>
              </td>
              <td>
                <xsl:call-template name="show-contactInfo">
                  <xsl:with-param name="contact" select="/n1:ClinicalDocument/n1:legalAuthenticator/n1:assignedEntity"/>
                  <xsl:with-param name="showUse" select="false()"/>
                </xsl:call-template>
              </td>
            </tr>
          </xsl:if>
        </tbody>
      </table>
    </xsl:if>
  </xsl:template>
  <!-- dataEnterer -->
  <xsl:template name="dataEnterer">
    <xsl:if test="/n1:ClinicalDocument/n1:dataEnterer">
      <!--    <hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/> -->
      <table class="header_table">
        <tbody>
          <tr>
            <td>
              <span class="td_label">
                <xsl:text>Entered by</xsl:text>
              </span>
            </td>
            <td>
              <xsl:call-template name="show-assignedEntity">
                <xsl:with-param name="asgnEntity" select="/n1:ClinicalDocument/n1:dataEnterer/n1:assignedEntity"/>
              </xsl:call-template>
            </td>
          </tr>
          <xsl:if test="/n1:ClinicalDocument/n1:dataEnterer/n1:assignedEntity/n1:addr | /n1:ClinicalDocument/n1:dataEnterer/n1:assignedEntity/n1:telecom">
            <tr>
              <td >
                <span class="td_label">
                  <xsl:text>Contact info</xsl:text>
                </span>
              </td>
              <td>
                <xsl:call-template name="show-contactInfo">
                  <xsl:with-param name="contact" select="/n1:ClinicalDocument/n1:dataEnterer/n1:assignedEntity"/>
                  <xsl:with-param name="showUse" select="false()"/>
                </xsl:call-template>
              </td>
            </tr>
          </xsl:if>
        </tbody>
      </table>
    </xsl:if>
  </xsl:template>
  <!-- custodian -->
  <!--<xsl:template name="custodian">
		<xsl:if test="n1:custodian">
			<table class="header_table">
				<tbody>
					<tr>
						<td>
							<span class="td_label">
								<xsl:text>Document maintained by</xsl:text>
							</span>
						</td>
						<td>
							<xsl:choose>
								<xsl:when test="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name">
									<xsl:call-template name="show-name">
										<xsl:with-param name="name" select="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:for-each select="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:id">
										<xsl:call-template name="show-id"/>
										<xsl:if test="position()!=last()">
											<br/>
										</xsl:if>
									</xsl:for-each>
								</xsl:otherwise>
							</xsl:choose>
						</td>
					</tr>
					<xsl:if test="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:addr | 						n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:telecom">
						<tr>
							<td >
								<span class="td_label">
									<xsl:text>Contact info</xsl:text>
								</span>
							</td>
							<td>
								<xsl:call-template name="show-contactInfo">
									<xsl:with-param name="contact" select="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization"/>
									<xsl:with-param name="showUse" select="false()"/>
								</xsl:call-template>
							</td>
						</tr>
					</xsl:if>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>-->
  <!-- careTeam - This is a combined list of providers found in the documentationOf and componentOf sections. -->
  <xsl:template name="careTeam">
    <xsl:if test="/n1:ClinicalDocument/n1:documentationOf | /n1:ClinicalDocument/n1:componentOf">

      <div style="float:right;">
        <xsl:variable name="combinedCareTeam">
          <xsl:call-template name="getCombinedCareTeam"/>
        </xsl:variable>

        <!-- Inside this XSl:Choose it checks if exslt function is available to use if it is it goes through when loop or it goes through otherwise and uses msxsl for node set-->
        <xsl:choose>
          <xsl:when test="function-available('exslt:node-set')">
            <xsl:for-each select="exslt:node-set($combinedCareTeam)/person">
              <xsl:sort select="." data-type="text" order="ascending"/>
              <xsl:if test="not(.=preceding-sibling::person)">
                <xsl:choose>
                  <xsl:when test="position() = 1">
                    <span class="td_label">
                      <xsl:text>Care Team</xsl:text>
                      <br />
                    </span>
                  </xsl:when>
                  <xsl:otherwise>
                    <span class="td_label" />
                  </xsl:otherwise>
                </xsl:choose>

                <xsl:value-of select="./name"/>
                <xsl:for-each select="./telcom">
                  <br/>
                  <xsl:value-of select="."/>
                </xsl:for-each>
                <xsl:variable name="addrSeparator">
                  <xsl:choose>
                    <xsl:when test="count(./address) &gt; 1">
                      <xsl:text>&#160;&#160;&#160;&#160;&#160;</xsl:text>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:text></xsl:text>
                    </xsl:otherwise>
                  </xsl:choose>
                </xsl:variable>
                <xsl:if test="./addr">
                  <br/>
                  <xsl:call-template name="show-temp-address">
                    <xsl:with-param name="address" select="./addr"/>
                    <xsl:with-param name="showUse" select="false()"/>
                  </xsl:call-template>
                </xsl:if>
                <br/>
                <br/>

              </xsl:if>
            </xsl:for-each>
          </xsl:when>
          <xsl:when test="function-available('msxsl:node-set')">
            <xsl:for-each select="msxsl:node-set($combinedCareTeam)/person">
              <xsl:sort select="." data-type="text" order="ascending"/>

              <xsl:if test="not(.=preceding-sibling::person)">


                <xsl:choose>
                  <xsl:when test="position() = 1">
                    <span class="td_label">
                      <xsl:text>Care Team</xsl:text>
                      <br />
                    </span>
                  </xsl:when>
                  <xsl:otherwise>
                    <span class="td_label" />
                  </xsl:otherwise>
                </xsl:choose>

                <xsl:value-of select="./name"/>
                <xsl:for-each select="./telcom">
                  <br/>
                  <xsl:value-of select="."/>
                </xsl:for-each>
                <xsl:variable name="addrSeparator">
                  <xsl:choose>
                    <xsl:when test="count(./address) &gt; 1">
                      <xsl:text>&#160;&#160;&#160;&#160;&#160;</xsl:text>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:text></xsl:text>
                    </xsl:otherwise>
                  </xsl:choose>
                </xsl:variable>
                <xsl:if test="./addr">
                  <br/>
                  <xsl:call-template name="show-temp-address">
                    <xsl:with-param name="address" select="./addr"/>
                    <xsl:with-param name="showUse" select="false()"/>
                  </xsl:call-template>
                </xsl:if>
                <br/>
                <br/>

              </xsl:if>
            </xsl:for-each>
          </xsl:when>
        </xsl:choose>
      </div>
    </xsl:if>
  </xsl:template>
  <!-- inFulfillmentOf -->
  <xsl:template name="inFulfillmentOf">
    <xsl:if test="/n1:ClinicalDocument/n1:infulfillmentOf">
      <!--     <hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/> -->
      <table class="header_table">
        <tbody>
          <xsl:for-each select="/n1:ClinicalDocument/n1:inFulfillmentOf">
            <tr>
              <td>
                <span class="td_label">
                  <xsl:text>In fulfillment of</xsl:text>
                </span>
              </td>
              <td>
                <xsl:for-each select="n1:order">
                  <xsl:for-each select="n1:id">
                    <xsl:call-template name="show-id"/>
                  </xsl:for-each>
                  <xsl:for-each select="n1:code">
                    <xsl:text>&#160;</xsl:text>
                    <xsl:call-template name="show-code">
                      <xsl:with-param name="code" select="."/>
                    </xsl:call-template>
                  </xsl:for-each>
                  <xsl:for-each select="n1:priorityCode">
                    <xsl:text>&#160;</xsl:text>
                    <xsl:call-template name="show-code">
                      <xsl:with-param name="code" select="."/>
                    </xsl:call-template>
                  </xsl:for-each>
                </xsl:for-each>
              </td>
            </tr>
          </xsl:for-each>
        </tbody>
      </table>
    </xsl:if>
  </xsl:template>
  <!-- informant -->
  <xsl:template name="informant">
    <xsl:if test="n1:informant">
      <!--     <hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/> -->
      <table class="header_table">
        <tbody>
          <xsl:for-each select="n1:informant">
            <tr>
              <td>
                <span class="td_label">
                  <xsl:text>Informant</xsl:text>
                </span>
              </td>
              <td>
                <xsl:if test="n1:assignedEntity">
                  <xsl:call-template name="show-assignedEntity">
                    <xsl:with-param name="asgnEntity" select="n1:assignedEntity"/>
                  </xsl:call-template>
                </xsl:if>
                <xsl:if test="n1:relatedEntity">
                  <xsl:call-template name="show-relatedEntity">
                    <xsl:with-param name="relatedEntity" select="n1:relatedEntity"/>
                  </xsl:call-template>
                </xsl:if>
              </td>
            </tr>
            <xsl:choose>
              <xsl:when test="n1:assignedEntity/n1:addr | n1:assignedEntity/n1:telecom">
                <tr>
                  <td >
                    <span class="td_label">
                      <xsl:text>Contact info</xsl:text>
                    </span>
                  </td>
                  <td>
                    <xsl:if test="n1:assignedEntity">
                      <xsl:call-template name="show-contactInfo">
                        <xsl:with-param name="contact" select="n1:assignedEntity"/>
                        <xsl:with-param name="showUse" select="false()"/>
                      </xsl:call-template>
                    </xsl:if>
                  </td>
                </tr>
              </xsl:when>
              <xsl:when test="n1:relatedEntity/n1:addr | n1:relatedEntity/n1:telecom">
                <tr>
                  <td >
                    <span class="td_label">
                      <xsl:text>Contact info</xsl:text>
                    </span>
                  </td>
                  <td>
                    <xsl:if test="n1:relatedEntity">
                      <xsl:call-template name="show-contactInfo">
                        <xsl:with-param name="contact" select="n1:relatedEntity"/>
                        <xsl:with-param name="showUse" select="false()"/>
                      </xsl:call-template>
                    </xsl:if>
                  </td>
                </tr>
              </xsl:when>
            </xsl:choose>
          </xsl:for-each>
        </tbody>
      </table>
    </xsl:if>
  </xsl:template>
  <!-- informantionRecipient -->
  <xsl:template name="informationRecipient">
    <xsl:if test="n1:informationRecipient">
      <!--      <hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/> -->
      <table class="header_table">
        <tbody>
          <xsl:for-each select="n1:informationRecipient">
            <tr>
              <td>
                <span class="td_label">
                  <xsl:text>Information recipient:</xsl:text>
                </span>
              </td>
              <td>
                <xsl:choose>
                  <xsl:when test="n1:intendedRecipient/n1:informationRecipient/n1:name">
                    <xsl:for-each select="n1:intendedRecipient/n1:informationRecipient">
                      <xsl:call-template name="show-name">
                        <xsl:with-param name="name" select="n1:name"/>
                      </xsl:call-template>
                      <xsl:if test="position() != last()">
                        <br/>
                      </xsl:if>
                    </xsl:for-each>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:for-each select="n1:intendedRecipient">
                      <xsl:for-each select="n1:id">
                        <xsl:call-template name="show-id"/>
                      </xsl:for-each>
                      <xsl:if test="position() != last()">
                        <br/>
                      </xsl:if>
                      <br/>
                    </xsl:for-each>
                  </xsl:otherwise>
                </xsl:choose>
              </td>
            </tr>
            <xsl:if test="n1:intendedRecipient/n1:addr | n1:intendedRecipient/n1:telecom">
              <tr>
                <td >
                  <span class="td_label">
                    <xsl:text>Contact info</xsl:text>
                  </span>
                </td>
                <td>
                  <xsl:call-template name="show-contactInfo">
                    <xsl:with-param name="contact" select="n1:intendedRecipient"/>
                    <xsl:with-param name="showUse" select="true()"/>
                  </xsl:call-template>
                </td>
              </tr>
            </xsl:if>
          </xsl:for-each>
        </tbody>
      </table>
    </xsl:if>
  </xsl:template>
  <xsl:template name="participant">
    <xsl:if test="n1:participant">
      <!--    <hr align="left" style="border-top:1px solid #E1E3E5;border-bottom:1px solid #FFFFFF;" size="1" color="#F0F1F2" width="100%"/> -->
      <table class="header_table">
        <tbody>
          <xsl:for-each select="n1:participant">
            <tr>
              <td>
                <xsl:variable name="participtRole">
                  <xsl:call-template name="translateRoleAssoCode">
                    <xsl:with-param name="code" select="n1:associatedEntity/@classCode"/>
                  </xsl:call-template>
                </xsl:variable>
                <xsl:choose>
                  <xsl:when test="$participtRole">
                    <span class="td_label">
                      <xsl:call-template name="firstCharCaseUp">
                        <xsl:with-param name="data" select="$participtRole"/>
                      </xsl:call-template>
                    </span>
                  </xsl:when>
                  <xsl:otherwise>
                    <span class="td_label">
                      <xsl:text>Participant</xsl:text>
                    </span>
                  </xsl:otherwise>
                </xsl:choose>
              </td>
              <td>
                <xsl:if test="n1:functionCode">
                  <xsl:call-template name="show-code">
                    <xsl:with-param name="code" select="n1:functionCode"/>
                  </xsl:call-template>
                </xsl:if>
                <xsl:call-template name="show-associatedEntity">
                  <xsl:with-param name="assoEntity" select="n1:associatedEntity"/>
                </xsl:call-template>
                <xsl:if test="n1:time">
                  <xsl:if test="n1:time/n1:low">
                    <xsl:text> from </xsl:text>
                    <xsl:call-template name="show-time">
                      <xsl:with-param name="datetime" select="n1:time/n1:low"/>
                    </xsl:call-template>
                  </xsl:if>
                  <xsl:if test="n1:time/n1:high/@value">
                    <xsl:text> to </xsl:text>
                    <xsl:call-template name="show-time">
                      <xsl:with-param name="datetime" select="n1:time/n1:high"/>
                    </xsl:call-template>
                  </xsl:if>
                </xsl:if>
                <xsl:if test="position() != last()">
                  <br/>
                </xsl:if>
              </td>
            </tr>
            <xsl:if test="n1:associatedEntity/n1:addr | n1:associatedEntity/n1:telecom">
              <tr>
                <td >
                  <span class="td_label">
                    <xsl:text>Contact info</xsl:text>
                  </span>
                </td>
                <td>
                  <xsl:call-template name="show-contactInfo">
                    <xsl:with-param name="contact" select="n1:associatedEntity"/>
                    <xsl:with-param name="showUse" select="false()"/>
                  </xsl:call-template>
                </td>
              </tr>
            </xsl:if>
          </xsl:for-each>
        </tbody>
      </table>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>
