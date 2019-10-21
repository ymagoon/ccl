<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:java-string="java:java.lang.String"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	exclude-result-prefixes="xsl xs fn n cdocfx java-string">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

	<!-- Backend system locale passed as a paramter -->
	<xsl:param as="xs:string" name="SystemLocale" select="''"/>

	<!-- Required to include CommonFxn.xslt -->
	<!-- Comment out this line to debug -->	<xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/>
	<!-- Uncomment this line to debug <xsl:include href="CommonFxn.xslt"/> -->

	<xsl:variable name="Separator" as="xs:string">	<!-- Seperator between detail components -->
		<xsl:value-of select="',  %s'"/>
	</xsl:variable>
	<xsl:variable name="Connect" as="xs:string"> 	<!-- Connect two strings as one with a space in between -->
		<xsl:value-of select="'%s %s'"/>
	</xsl:variable>
	<xsl:variable name="OrderComplianceComment" as="xs:string">
		<xsl:value-of select="':  %s'"/>
	</xsl:variable>
	<xsl:variable name="Prn" as="xs:string">
		<xsl:value-of select="'PRN'"/>
	</xsl:variable>
	<xsl:variable name="Refills" as="xs:string">
		<xsl:value-of select="'refills'"/>
	</xsl:variable>
	<xsl:variable name="volumeSeperator" as="xs:string">
		<xsl:value-of select="'=  %s'"/>
	</xsl:variable>
	<xsl:variable name="IsIndented" as="xs:boolean">
		<xsl:value-of select="false()"/>
	</xsl:variable>

	<!-- Format the given medication-order as ddemrcontentitem -->
	<xsl:template match="n:medication-order">
		<xsl:choose>
			<xsl:when test="$IsIndented">
				<div class="ddemrcontentitem ddremovable" style="margin-left: 1em; padding-left:1em; text-indent:-1em;">
					<xsl:attribute name="dd:entityid">
						<xsl:value-of select="@order-id"/>
					</xsl:attribute>
					<xsl:attribute name="dd:contenttype">
						<xsl:text>MEDICATIONS</xsl:text>
					</xsl:attribute>

					<xsl:value-of select="@clinical-name"/>
					<!-- One Medication Order can have many Ingredients -->
					<!-- If a medication have more than one ingredient, we display the Clinical name only-->
					<xsl:if test="count(n:medication-ingredient)&lt;= 1">

						<!-- Dose -->
						<xsl:variable name="Dose" as="xs:string">
							<xsl:choose>
								<xsl:when test="n:medication-ingredient/n:dose[@strength-unit-code]">		
									<!-- Remove Trailing Zeros based on Locale -->
									<xsl:variable name="Strength" select="cdocfx:removeTrailingZeros(n:medication-ingredient/n:dose/@strength, $SystemLocale)"/>
									<xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID(n:medication-ingredient/n:dose/@strength-unit-code)"/>
									<xsl:value-of select="java-string:format($Connect, ($Strength, $sUnit))"/>
								</xsl:when>
								<!-- Free Text Dose -->
								<xsl:when test="n:medication-ingredient/n:dose[@freetext-dose]">
									<xsl:value-of select="n:medication-ingredient/n:dose/@freetext-dose"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="''"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>

						<xsl:if test="$Dose != ''">	
							<xsl:value-of select="java-string:format($Separator, $Dose)"/> 
						</xsl:if>
						
						<xsl:choose>
							<xsl:when test="n:medication-ingredient/n:dose[@volume-unit-code] and
								n:medication-ingredient/n:dose[@strength-unit-code]">
								<!-- Remove Trailing Zeros based on Locale -->
								<xsl:variable name="Volume" select="cdocfx:removeTrailingZeros(n:medication-ingredient/n:dose/@volume, $SystemLocale)"/>
								<xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID(n:medication-ingredient/n:dose/@volume-unit-code)"/>
								<xsl:value-of select="java-string:format($volumeSeperator, java-string:format($Connect, ($Volume, $sUnit)))"/>
							</xsl:when>
							<xsl:when test="n:medication-ingredient/n:dose[@volume-unit-code]">
								<!-- Remove Trailing Zeros based on Locale -->
								<xsl:variable name="Volume" select="cdocfx:removeTrailingZeros(n:medication-ingredient/n:dose/@volume, $SystemLocale)"/>
								<xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID(n:medication-ingredient/n:dose/@volume-unit-code)"/>
								<xsl:value-of select="java-string:format($Separator, java-string:format($Connect, ($Volume, $sUnit)))"/>
							</xsl:when>	
						</xsl:choose>
						
						<xsl:if test="n:medication-ingredient/n:dose[@ordered-unit-code]">
							<!-- Remove Trailing Zeros based on Locale -->
							<xsl:variable name="Ordered" select="cdocfx:removeTrailingZeros(n:medication-ingredient/n:dose/@ordered, $SystemLocale)"/>
							<xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID(n:medication-ingredient/n:dose/@ordered-unit-code)"/>
							<xsl:value-of select="java-string:format($Separator, java-string:format($Connect, ($Ordered, $sUnit)))"/>
						</xsl:if>
						
						<!-- Route of administration -->
						<xsl:if test="@route-of-administration-code">
							<xsl:variable name="sRouteAdministration" as="xs:string" select="cdocfx:getCodeDisplayByID(@route-of-administration-code)"/>
							<xsl:value-of select="java-string:format($Separator, $sRouteAdministration)"/>
						</xsl:if>
						
						<!-- Frequency -->
						<xsl:if test="n:order-schedule/n:frequency">
							<xsl:variable name="sFrequency" as="xs:string"	select="cdocfx:getCodeDisplayByID(n:order-schedule/n:frequency/descendant::node()/@frequency-code)"/>
							<xsl:value-of select="java-string:format($Separator, $sFrequency)"/>
						</xsl:if>
						
						<!-- PRN -->
						<xsl:if test="n:order-schedule/@is-prn='true'">
							<xsl:value-of select="java-string:format($Separator, $Prn)"/>
						</xsl:if>
						
						<!-- Number of Refills -->
						<xsl:if test="@total-fills &gt; 0">
							<!-- Remove Trailing Zeros based on Locale -->
							<xsl:variable name="sTotalFills" as="xs:string" select="cdocfx:removeTrailingZeros(@total-fills, $SystemLocale)"/>
							<xsl:value-of select="java-string:format($Separator, java-string:format($Connect, ($sTotalFills, $Refills)))"/>
						</xsl:if>
						
						<!-- Checking if medication is not compliant -->
						<xsl:for-each select="n:order-compliance/n:performed-dt-tm">
							<xsl:sort select="." order="descending"/>
							<xsl:if test="position()=1">
								<xsl:if
									test="../@status-code and not(cdocfx:getCodeMeanByID(../@status-code) ='TAKINGASRX')">
									<xsl:text disable-output-escaping="yes">,<![CDATA[&#160; &#160;]]></xsl:text>
									<b><xsl:value-of select="cdocfx:getCodeDisplayByID(../@status-code)"/></b>
									<xsl:if test="../n:comment">
										<xsl:variable name="sComment" select="../n:comment" as="xs:string"/>
										<xsl:value-of select="java-string:format($OrderComplianceComment, $sComment)"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
						
					</xsl:if>
				</div>
			</xsl:when>
			<xsl:otherwise>
				<div class="ddemrcontentitem ddremovable" style="padding-left:1em; text-indent:-1em;">
					<xsl:attribute name="dd:entityid">
						<xsl:value-of select="@order-id"/>
					</xsl:attribute>
					<xsl:attribute name="dd:contenttype">
						<xsl:text>MEDICATIONS</xsl:text>
					</xsl:attribute>
					
					<xsl:value-of select="@clinical-name"/>
					<!-- One Medication Order can have many Ingredients -->
					<!-- If a medication have more than one ingredient, we display the Clinical name only-->
					<xsl:if test="count(n:medication-ingredient)&lt;= 1">
						
						<!-- Dose -->
						<xsl:variable name="Dose" as="xs:string">
							<xsl:choose>
								<xsl:when test="n:medication-ingredient/n:dose[@strength-unit-code]">		
									<!-- Remove Trailing Zeros based on Locale -->
									<xsl:variable name="Strength" select="cdocfx:removeTrailingZeros(n:medication-ingredient/n:dose/@strength, $SystemLocale)"/>
									<xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID(n:medication-ingredient/n:dose/@strength-unit-code)"/>
									<xsl:value-of select="java-string:format($Connect, ($Strength, $sUnit))"/>
								</xsl:when>
								<!-- Free Text Dose -->
								<xsl:when test="n:medication-ingredient/n:dose[@freetext-dose]">
									<xsl:value-of select="n:medication-ingredient/n:dose/@freetext-dose"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="''"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>
						
						<xsl:if test="$Dose != ''">	
							<xsl:value-of select="java-string:format($Separator, $Dose)"/> 
						</xsl:if>
						
						<xsl:choose>
							<xsl:when test="n:medication-ingredient/n:dose[@volume-unit-code] and
								n:medication-ingredient/n:dose[@strength-unit-code]">
								<!-- Remove Trailing Zeros based on Locale -->
								<xsl:variable name="Volume" select="cdocfx:removeTrailingZeros(n:medication-ingredient/n:dose/@volume, $SystemLocale)"/>
								<xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID(n:medication-ingredient/n:dose/@volume-unit-code)"/>
								<xsl:value-of select="java-string:format($volumeSeperator, java-string:format($Connect, ($Volume, $sUnit)))"/>
							</xsl:when>
							<xsl:when test="n:medication-ingredient/n:dose[@volume-unit-code]">
								<!-- Remove Trailing Zeros based on Locale -->
								<xsl:variable name="Volume" select="cdocfx:removeTrailingZeros(n:medication-ingredient/n:dose/@volume, $SystemLocale)"/>
								<xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID(n:medication-ingredient/n:dose/@volume-unit-code)"/>
								<xsl:value-of select="java-string:format($Separator, java-string:format($Connect, ($Volume, $sUnit)))"/>
							</xsl:when>	
						</xsl:choose>
						
						<xsl:if test="n:medication-ingredient/n:dose[@ordered-unit-code]">
							<!-- Remove Trailing Zeros based on Locale -->
							<xsl:variable name="Ordered" select="cdocfx:removeTrailingZeros(n:medication-ingredient/n:dose/@ordered, $SystemLocale)"/>
							<xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID(n:medication-ingredient/n:dose/@ordered-unit-code)"/>
							<xsl:value-of select="java-string:format($Separator, java-string:format($Connect, ($Ordered, $sUnit)))"/>
						</xsl:if>
						
						<!-- Route of administration -->
						<xsl:if test="@route-of-administration-code">
							<xsl:variable name="sRouteAdministration" as="xs:string" select="cdocfx:getCodeDisplayByID(@route-of-administration-code)"/>
							<xsl:value-of select="java-string:format($Separator, $sRouteAdministration)"/>
						</xsl:if>
						
						<!-- Frequency -->
						<xsl:if test="n:order-schedule/n:frequency">
							<xsl:variable name="sFrequency" as="xs:string"	select="cdocfx:getCodeDisplayByID(n:order-schedule/n:frequency/descendant::node()/@frequency-code)"/>
							<xsl:value-of select="java-string:format($Separator, $sFrequency)"/>
						</xsl:if>
						
						<!-- PRN -->
						<xsl:if test="n:order-schedule/@is-prn='true'">
							<xsl:value-of select="java-string:format($Separator, $Prn)"/>
						</xsl:if>
						
						<!-- Number of Refills -->
						<xsl:if test="@total-fills &gt; 0">
							<!-- Remove Trailing Zeros based on Locale -->
							<xsl:variable name="sTotalFills" as="xs:string" select="cdocfx:removeTrailingZeros(@total-fills, $SystemLocale)"/>
							<xsl:value-of select="java-string:format($Separator, java-string:format($Connect, ($sTotalFills, $Refills)))"/>
						</xsl:if>
						
						<!-- Checking if medication is not compliant -->
						<xsl:for-each select="n:order-compliance/n:performed-dt-tm">
							<xsl:sort select="." order="descending"/>
							<xsl:if test="position()=1">
								<xsl:if
									test="../@status-code and not(cdocfx:getCodeMeanByID(../@status-code) ='TAKINGASRX')">
									<xsl:text disable-output-escaping="yes">,<![CDATA[&#160; &#160;]]></xsl:text>
									<b><xsl:value-of select="cdocfx:getCodeDisplayByID(../@status-code)"/></b>
									<xsl:if test="../n:comment">
										<xsl:variable name="sComment" select="../n:comment" as="xs:string"/>
										<xsl:value-of select="java-string:format($OrderComplianceComment, $sComment)"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
						
					</xsl:if>
				</div>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
