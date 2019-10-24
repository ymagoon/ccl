<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="2.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:footnote"
	xmlns:dd="DynamicDocumentation"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	exclude-result-prefixes="xsl xs fn n cdocfx xr-date-formatter">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

	<!-- Required to include CommonFxn.xslt -->
	<!-- Comment out this line to debug --><xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/>
	<!-- Uncomment this line to debug  <xsl:include href="../CommonFxn.xslt"/> -->

	<!-- This will be over-written during Run-Time -->
	<xsl:variable name="bIsUTCOn" as="xs:boolean" select="true()"/>

	<!-- Default string constants -->
	<xsl:variable name="DATE_SEQUENCE_UTC_ON" as="xs:string" select="'MM/dd/yyyy HH:mm zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF" as="xs:string" select="'MM/dd/yyyy HH:mm'"/>

	<!-- This is a derived variable and doesn't need to go in the i18n string tables -->
	<xsl:variable name="DATE_SEQUENCE" as="xs:string" select="cdocfx:getDateDisplayPattern($bIsUTCOn, $DATE_SEQUENCE_UTC_ON, $DATE_SEQUENCE_UTC_OFF)"/>

	<!-- This is the main template -->
	<xsl:template match="/">
		<xsl:for-each select="n:report">
			<xsl:call-template name="footnote">
				<xsl:with-param name="footNoteEle" select="n:footnote"/>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="footnote">
		<xsl:param name="footNoteEle"/>
		<div class="ddemrcontentitem">
			<xsl:attribute name="style">
				<xsl:value-of select="'padding:6px;height:50px;border-top:solid 1px #dddddd;'"/>
			</xsl:attribute>
			<xsl:attribute name="dd:entityid">
				<xsl:value-of select="$footNoteEle/@pdoc-tagtext-id"/>
			</xsl:attribute>
			<xsl:attribute name="dd:tagtextentityid">
				<xsl:value-of select="$footNoteEle/@event-id"/>
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<!-- We need to use xsl:value-of here instead of xsl:text like most other formats use because otherwise we cannot drag and drop into the editor.  
				Using xsl:text causes the content of the attribute to be pretty-printed such that there is a new line and spacing before and after the actual 
				text which causes the JavaScript to not match on the element correctly. -->
				<xsl:value-of select="'TAGTEXT'"/>
			</xsl:attribute>

			<xsl:variable name="UpdateDtTm">
				<xsl:variable name="Timezone" select="$footNoteEle/n:note/n:service-dt-tm/@time-zone"/>
				<xsl:variable name="ServiceDate" as="xs:dateTime" select="$footNoteEle/n:note/n:service-dt-tm"/>
				<xsl:value-of select="xr-date-formatter:formatDate($ServiceDate, $DATE_SEQUENCE, $Timezone, $current-locale)"/>
			</xsl:variable>

			<xsl:variable name="displayTitle">
				<xsl:value-of select="cdocfx:getNoteTitleDisplay($footNoteEle)"/>
			</xsl:variable>

			<span class="ddtitle">
				<xsl:attribute name="style">
					<xsl:value-of select="'color:#9f9f9f;float:left;margin-right:4px;max-height:24px;max-width:55%;overflow:hidden;text-overflow:ellipsis;'"/>
				</xsl:attribute>
				<xsl:attribute name="title">
					<xsl:value-of select="$displayTitle"/>
				</xsl:attribute>
				<xsl:value-of select="$displayTitle"/>
			</span>

			<div class="ddupdtdttm">
				<xsl:attribute name="style">
					<xsl:value-of select="'color:#9f9f9f;font-size:10px;float:right;margin-right:24px;max-width:35%;overflow:hidden;text-overflow:ellipsis;'"/>
				</xsl:attribute>
				<xsl:attribute name="title">
					<xsl:value-of select="$UpdateDtTm"/>
				</xsl:attribute>
				<xsl:value-of select="$UpdateDtTm"/>
			</div>

			<div class="ddwrappedtext">
				<xsl:attribute name="style">
					<xsl:value-of select="'clear:both;color:#505050;margin-right:24px;max-height:24px;overflow:hidden;text-overflow:ellipsis;word-wrap:normal;white-space:nowrap;margin-top:6px;'"/>
				</xsl:attribute>
				<xsl:attribute name="title">
					<xsl:value-of select="$footNoteEle/n:text"/>
				</xsl:attribute>
				<xsl:value-of select="$footNoteEle/n:text"/>
			</div>

			<div class="ddformattedtext">
				<xsl:attribute name="style">
					<xsl:value-of select="'display:none;clear:both;color:#505050;margin-right:24px;max-height:24px;overflow:hidden;text-overflow:ellipsis;word-wrap:normal;white-space:nowrap;margin-top:6px;'"/>
				</xsl:attribute>
				<xsl:attribute name="title">
					<xsl:value-of disable-output-escaping="yes" select="$footNoteEle/n:formattedtext"/>
				</xsl:attribute>
				<xsl:choose>
					<xsl:when test="$footNoteEle/n:note/@doc-type='RADIOLOGY' and $displayTitle">
						<xsl:value-of select="concat('(', $UpdateDtTm, ' ', $displayTitle, ') ')"/>
					</xsl:when>
				</xsl:choose>
				<xsl:value-of disable-output-escaping="yes" select="$footNoteEle/n:formattedtext"/>
			</div>
		</div>
	</xsl:template>

</xsl:stylesheet>
