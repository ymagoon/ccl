<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="8.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:TaggedImage"
	xmlns:dd="DynamicDocumentation"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	exclude-result-prefixes="xsl xs fn n cdocfx xr-date-formatter">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

	<!-- Required to include CommonFxn.xslt -->
	<!-- Comment out this line to debug --> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/>
	<!-- Uncomment this line to debug <xsl:include href="../CommonFxn.xslt"/>-->
	
	<!-- This will be over-written during Run-Time -->
	<xsl:variable name="bIsUTCOn" as="xs:boolean" select="true()"/>
	
	<!-- Default string constants -->
	<xsl:variable name="DATE_SEQUENCE_UTC_ON" as="xs:string" select="'MM/dd/yyyy HH:mm zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF" as="xs:string" select="'MM/dd/yyyy HH:mm'"/>
	
	<!-- This is a derived variable and doesn't need to go in the i18n string tables -->
	<xsl:variable name="DATE_SEQUENCE" as="xs:string" select="cdocfx:getDateDisplayPattern($bIsUTCOn, $DATE_SEQUENCE_UTC_ON, $DATE_SEQUENCE_UTC_OFF)"/>
	
	<!-- This is the main template -->
	<xsl:template match="/">
		<xsl:for-each select="n:report/n:ddimage">
			<xsl:call-template name="formatClipboardImage">
				<xsl:with-param name="imageElem" select="."/>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>
	
	<!-- Template to format Image display in clipboard -->
	<xsl:template name="formatClipboardImage">
		<xsl:param name="imageElem"/>
		<div xmlns:dd="DynamicDocumentation" class="ddemrcontentitem">
			<xsl:attribute name="style">
				<xsl:value-of select="'padding:6px;height:50px;border-top:solid 1px #dddddd;position:relative'"/>
			</xsl:attribute>
			<xsl:attribute name="dd:blobhandle">
				<xsl:value-of select="$imageElem/@blob-handle"/>
			</xsl:attribute>
			<xsl:attribute name="dd:storagecodemean">
				<xsl:value-of select="$imageElem/@storage-code-mean"/>
			</xsl:attribute>
			<xsl:attribute name="dd:formatcodemean">
				<xsl:value-of select="$imageElem/@format-code-mean"/>
			</xsl:attribute>
			<xsl:attribute name="dd:refuuid">
				<xsl:value-of select="$imageElem/@ref-uuid"/>
			</xsl:attribute>
			<xsl:if test="$imageElem/@pdoc-taghandle-id">
				<xsl:attribute name="dd:entityid">
					<xsl:value-of select="$imageElem/@pdoc-taghandle-id"/>
				</xsl:attribute>
			</xsl:if>
			<xsl:attribute name="dd:contenttype">
				<!-- We need to use xsl:value-of here instead of xsl:text like most other formats use because otherwise we cannot drag and drop into the editor.  
				Using xsl:text causes the content of the attribute to be pretty-printed such that there is a new line and spacing before and after the actual 
				text which causes the JavaScript to not match on the element correctly. -->
				<xsl:value-of select="'IMAGES'"/>
			</xsl:attribute>
			<div class="ddimage" style="color:#505050;float:left;height:44px;overflow:hidden;text-overflow:ellipsis;word-wrap:normal;white-space:nowrap;padding-top:6px;padding-bottom:6px">
				<xsl:attribute name="title">
					<xsl:value-of select="$imageElem/n:name"/>
				</xsl:attribute>
				<img class="ddimageclipboard" style="max-width:100%;max-height:100%;">
					<xsl:attribute name="alt">
						<xsl:value-of select="$imageElem/n:name"/>
					</xsl:attribute>
					<xsl:attribute name="src">
						<xsl:value-of select="cdocfx:buildBase64ImageDataURI($imageElem/n:clipboard-thumbnail)"/>
					</xsl:attribute>
				</img>
			</div>
			<span class="ddtitle ddemrcontenttext" style="color:#505050;float:right;margin-right:24px;max-height:24px;min-width:5%;max-width:55%;overflow:hidden;text-overflow:ellipsis;word-wrap:normal;">
				<xsl:attribute name="title">
					<xsl:value-of select="$imageElem/n:name"/>
				</xsl:attribute>
				<xsl:value-of select="$imageElem/n:name"/>
			</span>
			
			<!-- The date/timezone of the tagged image works if the below code is uncommented.  This would allow clients to easily get date/time working if they so choose  -->
			<!--  The date/time is service-dt-tm if it is available for the image, else it would take created date/time of the image. -->
			<!-- <xsl:variable name="ServiceDtTm">
				<xsl:variable name="Timezone" select="$imageElem/n:service-dt-tm/@time-zone"/>
				<xsl:variable name="ServiceDate" as="xs:dateTime" select="$imageElem/n:service-dt-tm"/>
				<xsl:value-of select="xr-date-formatter:formatDate($ServiceDate, $DATE_SEQUENCE, $Timezone, $current-locale)"/>
			</xsl:variable>
			<br/>
			<div class="ddupdtdttm">
				<xsl:attribute name="style">
					<xsl:value-of select="'color:#9f9f9f;font-size:10px;float:right;margin-right:24px;min-width:5%;max-width:45%;overflow:hidden;text-overflow:ellipsis;word-wrap:normal;'"/>
				</xsl:attribute>
				<xsl:attribute name="title">
					<xsl:value-of select="$ServiceDtTm"/>
				</xsl:attribute>
				<xsl:value-of select="$ServiceDtTm"/>
			</div> -->
		</div>
	</xsl:template>
</xsl:stylesheet>
