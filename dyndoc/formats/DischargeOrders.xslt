<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="3.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:xs="http://www.w3.org/2001/XMLSchema" 
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	exclude-result-prefixes="xsl xs fn cdocfx">

	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/orders.xslt" /> 
	<!--Uncomment this line to debug <xsl:import href="orders.xslt" /> -->

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	
	<!-- Functions defined here override the default functions defined in orders.xslt -->
	
	<!-- Detect if given order has been banned meaning that it should not be displayed. 
		Orders with catalog type other than NURS and activity type other than DISHORDERS are banned	-->
	<!-- Parameters: -->
	<!-- 	order - the medication or non medication order node that needs to be checked if banned -->
	<xsl:function name="cdocfx:isBannedOrder" as="xs:boolean">
		<xsl:param name="order"/>
		<xsl:choose>
			<xsl:when test="$order[@clinical-name='PLACE_BANNED_ORDER_NAME_HERE']">
				<xsl:value-of select="fn:true()"/>
			</xsl:when>
			<!-- Only want Discharge orders -->
			<xsl:when test="not(cdocfx:isActivityTypeCdOrder($order, 'DISHORDERS')) or not(cdocfx:isCatalogTypeCdOrder($order, 'NURS'))">
				<xsl:value-of select="fn:true()"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="fn:false()"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
</xsl:stylesheet>
