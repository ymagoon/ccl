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
	<!-- Uncomment this line to debug   <xsl:include href="CommonFxn.xslt"/> -->
	
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
			<xsl:call-template name="formatNoteImage">
				<xsl:with-param name="imageElem" select="."/>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>
	
	<!-- Template to format Image display in a note -->
	<xsl:template name="formatNoteImage">
		<xsl:param name="imageElem"/>
		<div class="ddemrcontentitem ddremovable ddtagged">
			<xsl:attribute name="dd:btnfloatingstyle">
				<xsl:value-of select="'top-right'"/>
			</xsl:attribute>
			<xsl:attribute name="style">
				<xsl:value-of select="'page-break-inside: avoid; text-align:center; display: inline-block; vertical-align: bottom; width: 200px; padding: 5px;'"/>
			</xsl:attribute>
			<xsl:if test="$imageElem/@pdoc-taghandle-id">
				<xsl:attribute name="dd:entityid">
					<xsl:value-of select="$imageElem/@pdoc-taghandle-id"/>
				</xsl:attribute>
			</xsl:if>
			<xsl:attribute name="dd:blobhandle">
				<xsl:value-of select="$imageElem/@blob-handle"/>
			</xsl:attribute>
			<xsl:attribute name="dd:storagecodemean">
				<xsl:value-of select="$imageElem/@storage-code-mean"/>
			</xsl:attribute>
			<xsl:attribute name="dd:formatcodemean">
				<xsl:value-of select="$imageElem/@format-code-mean"/>
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<!-- We need to use xsl:value-of here instead of xsl:text like most other formats use because otherwise we cannot drag and drop into the editor.  
				Using xsl:text causes the content of the attribute to be pretty-printed such that there is a new line and spacing before and after the actual 
				text which causes the JavaScript to not match on the element correctly. -->
				<xsl:value-of select="'IMAGES'"/>
			</xsl:attribute>
			<xsl:attribute name="dd:refuuid">
				<xsl:value-of select="$imageElem/@ref-uuid" />
			</xsl:attribute>

			<img>
				<xsl:attribute name="alt">
					<xsl:value-of select="$imageElem/n:name"/>
				</xsl:attribute>
				<xsl:attribute name="width">
					<xsl:value-of select="$imageElem/n:note-thumbnail/@width"/>
				</xsl:attribute>
				<xsl:attribute name="height">
					<xsl:value-of select="$imageElem/n:note-thumbnail/@height"/>
				</xsl:attribute>
				<xsl:attribute name="src"> <!-- Append  "data:image/jpeg;base64," to the image data. -->
					<xsl:value-of select="cdocfx:buildBase64ImageDataURI($imageElem/n:note-thumbnail)"/>
				</xsl:attribute>
			</img>
			<span style="display:block;word-wrap:break-word;" class="ddremovable">
				<xsl:value-of select="$imageElem/n:name"/>
			</span>
			
			<!-- The date/timezone of the tagged image works if the below code is uncommented.  This would allow clients to easily get date/time working if they so choose  -->
			<!--  The date/time is service-dt-tm if it is available for the image, else it would take created date/time of the image. -->
			<!-- <xsl:variable name="ServiceDtTm">
				<xsl:variable name="Timezone" select="$imageElem/n:service-dt-tm/@time-zone"/>
				<xsl:variable name="ServiceDate" as="xs:dateTime" select="$imageElem/n:service-dt-tm"/>
				<xsl:value-of select="xr-date-formatter:formatDate($ServiceDate, $DATE_SEQUENCE, $Timezone, $current-locale)"/>
			</xsl:variable>
			
			<span style="display:block" class="ddremovable">
				<xsl:value-of select="$ServiceDtTm"/>
			</span> -->
		</div>
	</xsl:template>
</xsl:stylesheet>
